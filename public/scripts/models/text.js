define([
	'underscore', 'backbone', 'libs/worker', 'libs/blob'
], function (_, Backbone, worker, blob) {

	var Text = Backbone.Model.extend({

		initialize : function (attrs, options) {

			_.bindAll(this);

			this.collection = options.collection;

			this.bind('change:op', this.perform, this);

			// this.perform().done(this.trigger.bind(this, 'change:added', this));

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
				op       : this.get('op'),
				previous : previous && previous.lines,
				file     : this.get('origin'),
				mask     : this.collection.mask
			};
		},

		destroy : function () {
			this.trigger("destroy", this); // bubbles to collection, that removes this
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

		activate : function (html) {
			this.collection.updateDocument(this, html);
		},

		afterWorker : function (message) {

			this.trigger('change:perform', this);

			// for now, sort and uniq dont return lines
			if ( !_.isUndefined(message.data.lines) ) {
				this.lines = blob.createBlob(message.data.lines);
			}

			this.set({ length : message.data.length });

			// // TODO: arrumar essa lógica. ao se adicionar um documento, ele
			// // só deve ser ativado se for o último.
			if(!this.getNext()){
				// this.activate(message.data.lines);
			}

		},

		getPrevious : function () {
			var index = this.collection.indexOf(this);
			return this.collection.at( index - 1 );
		},

		getNext : function () {
			// TODO: improve this method
			var id = this.id;
			return this.collection.detect(function (model) {
				return model.get('previous') === id;
			});
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
			this.bind('change:perform', function (m) {
				var index = this.indexOf(m);
				var next = this.at(index + 1);
				if (next) next.perform();
			}.bind(this));
		},

		updateDocument : function (m, html) {
			this.currentIndex = m.id;
			html = html || '';
			this.trigger('change:currentIndex', m.id, m, html);
		},

		blend : function (op, file, previous) {

			var m = new Text({
				id         : _.uniqueId('text'),
				fileName   : file.name,
				origin     : file,
				op         : op
			}, {
				collection : this
			});

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
