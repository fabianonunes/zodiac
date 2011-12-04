define([
	'underscore', 'backbone', 'libs/worker'
], function (_, Backbone, worker) {

	var Text = Backbone.Model.extend({

		initialize : function (attrs, options) {

			this.collection = options.collection;
			this.setPrevious(options.previous, { silent : true });

			this.bind('change:op', this.perform, this);
			this.bind('change:previous', this.perform, this);

			_.bindAll(this);

			this.perform().done(function(){

				this.trigger('change:added', this);

				// TODO: arrumar essa lógica. ao se adicionar um documento, ele
				// só deve ser ativado se for o último.
				if(!this.getNext()){
					this.activate();
				}

			}.bind(this));

		},

		perform : function () {

			var promise = this.work( this.expand )
				.done( this.afterWorker );

			var next = this.getNext();
			if ( next ) {
				next.perform();
			}

			return promise;

		},

		// when adding the properties to a queue, the values
		// must be the current values when invoking, not when added
		expand : function () {
			return {
				op       : this.get('op'),
				previous : this.getPrevious() && this.getPrevious().lines,
				file     : this.get('origin'),
				mask     : this.collection.mask
			};
		},

		destroy : function () {
			this.unbind();
			this.collection.destroy(this);
		},

		setPrevious : function (previous, options) {
			if (previous) {
				this.set({ previous : previous.id }, options);
			} else {
				this.set({ op : 'charge' });
			}
		},

		isActivated : function () {
			return this.collection.currentIndex === this.id;
		},

		acessor : function (op) {
			var self = this;
			self.work(function () {
				return {
					op : op,
					lines : self.lines
				};
			}).done( this.afterWorker );
		},

		activate : function () {
			this.collection.updateDocument(this);
		},

		afterWorker : function (message) {

			// for now, sort and uniq dont return lines
			if ( !_.isUndefined(message.data.lines) ) {
				this.lines = message.data.lines;
			}

			this.html = message.data.html;

			this.set({ length : message.data.length });

			if ( this.isActivated() ) {
				this.activate();
			}

		},

		getPrevious : function () {
			return this.collection.get(this.get('previous'));
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

		model        : Text,
		currentIndex : null,
		mask         : /[1-9]\d{0,6}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/g,

		initialize : function () {
			_.bindAll(this, 'updateDocument', 'blend');
			this.bind('destroy', this.remove);
		},

		updateDocument : function (m) {
			this.currentIndex = m.id;
			this.trigger('change:currentIndex', m.id, m, m.html);
		},

		destroy : function (m) {
			var next = m.getNext(), previous = m.getPrevious();
			if (previous) {
				previous.unbind('change:length', m.perform);
			}
			this.remove(m);
			if (this.length) {
				this.tie(next, previous);
			} else {
				this.reset();
			}
		},

		tie : function (next, previous) {
			if (next) {
				next.setPrevious(previous);
			} else if (previous) {
				previous.activate();
			}
		},

		blend : function (op, file, previous) {

			var next = previous && this.get(previous).getNext();

			var m = new Text({
				op         : op,
				origin     : file,
				fileName   : file.name,
				id         : _.uniqueId('text')
			}, {
				collection : this,
				previous   : this.get(previous) || this.currentDocument()
			});

			if(next){
				this.tie(next, m);
			}

			this.add(m, { silent : true, previous : previous });

		},

		acessor : function (op) {
			if (this.currentIndex) {
				this.currentDocument().acessor(op);
			}
		},

		currentDocument : function () {
			return this.get(this.currentIndex);
		}

	});

	return TextPeer;

});
