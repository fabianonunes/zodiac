define([
	'underscore', 'backbone', 'libs/worker', 'libs/blob'
], function (_, Backbone, worker, blob) {

	var Text = Backbone.Model.extend({

		initialize : function (attrs, options) {
			_.bindAll(this);
			this.collection = options.collection;
			this.bind('change:op', this.perform, this);
		},

		perform : function () {
			return this.work( this.expand )
				.done( this.afterWorker );
		},

		// when adding the properties to a queue, the values
		// must be the current values when invoking, not when added
		expand : function () {
			var previous = this.getPrevious();
			return {
				op       : previous ? this.get('op') : 'charge',
				previous : previous && previous.lines,
				file     : this.get('origin'),
				mask     : this.collection.mask
			};
		},

		destroy : function () {
			this.trigger('destroy', this); // bubbles to collection, that removes this
			this.unbind();
		},

		isActivated : function () {
			return this.collection.currentIndex === this.id;
		},

		acessor : function (op) {
			this.work(function (op, lines) {
				return { op : op, lines : lines };
			}.bind(null, op, this.lines)).done( this.afterWorker );
		},

		afterWorker : function (message) {

			// for now, sort and uniq dont return lines
			if ( !_.isUndefined(message.data.lines) ) {
				this.lines = blob.createBlob(message.data.lines);
			}

			this.set({ length : message.data.length });

			this.trigger('perform', this);

		},

		getPrevious : function () {
			var index = this.collection.indexOf(this);
			return this.collection.at( index - 1 );
		},

		getPath : function () {
			var ops = {
				union        : '\u222a',
				intersection : '\u2229',
				difference   : '\u2216',
				symmetric    : '\u2296',
				grep         : '*'
			}, path = [], m = this;

			while ( m ) {
				path.push(m.get('fileName'), ops[m.get('op')]);
				m = m.getPrevious();
			}
			path.pop();

			return path.reverse().join('');
		},

		work : function (optback) {
			var path = '/scripts/workers/text-worker.min.js';
			return worker( path, optback );
		}

	});

	var TextPeer = Backbone.Collection.extend({

		currentIndex : null,
		model        : Text,
		mask         : /[1-9]\d{0,6}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/g,

		initialize : function () {
			_.bindAll(this);
			this.bind('perform', this.goNext);
			this.bind('destroy', this.destroy);
		},

		goNext : function (m){
			var next = this.nextOf(m);
			return next ? next.perform() : this.updateDocument(m);
		},

		destroy : function (m) {
			var next = this.nextOf(m);
			this.remove(m);
			if (this.length === 0) {
				this.reset();
			} else if (next) {
				next.perform();
			}
		},

		updateDocument : function (m) {
			blob.readBlob(m.lines).done(function (event) {
				this.trigger('change:currentIndex', m.id, m, event.target.result);
			}.bind(this));
		},

		blend : function (op, file, previous) {

			var m = new Text({
				id         : _.uniqueId('text'),
				fileName   : file.name,
				origin     : file,
				op         : op
			}, { collection : this });

			if (previous) {
				this.add(m, {
					at       : this.indexOf( this.get(previous) ) + 1,
					silent   : true,
					previous : previous
				});
			} else {
				this.add(m, {
					silent : true,
					previous : previous
				});
			}

			m.perform().done(m.trigger.bind(m, 'change:added', m));

		},

		acessor : function (op) {
			if (this.currentIndex) {
				this.currentDocument().acessor(op);
			}
		},

		currentDocument : function () {
			return this.get(this.currentIndex);
		},

		nextOf : function (model) {
			var index = this.indexOf(model);
			return this.at(index + 1);
		},

		clear : function () {
			var models = [];
			this.forEach(function (m) {
				models.push(m);
				//_.defer(m.destroy);
			});
			models.forEach(function (m) {
				m.destroy();
			});
		}

	});

	return TextPeer;

});
