define(['underscore', 'backbone', 'libs/worker'], function (_, Backbone, worker) {

	var Text = Backbone.Model.extend({

		initialize : function (attrs, options) {

			this.collection = options.collection;
			this.setPrevious(options.previous, { silent : true });

			this.bind('change:op', this.perform, this);
			this.bind('change:previous', this.perform, this);

			this.perform(true);

		},

		perform : function (added) {

			worker('/scripts/workers/text-worker.min.js', {
				op : this.get('op'),
				previous : this.getPrevious() && this.getPrevious().lines,
				file : this.get('origin'),
				mask : this.collection.mask
			}, this.afterWork.bind(this, added));

		},

		destroy : function () {
			this.unbind();
			this.collection.destroy(this);
		},

		setPrevious : function (previous, options) {

			if (previous) {
				this.set({ previous : previous.id }, options);
				previous.bind('change:length', this.perform, this);
			} else {
				this.set({ op : 'charge' });
			}

		},

		isActivated : function () {
			return this.collection.currentIndex === this.id;
		},

		sort : function () {

			worker('/scripts/workers/text-worker.min.js', {
				op : 'sort',
				lines : this.lines
			}, this.afterWork.bind(this, false));

		},

		uniq : function () {

			worker('/scripts/workers/text-worker.min.js', {
				op : 'uniq',
				lines : this.lines
			}, this.afterWork.bind(this, false));

		},

		activate : function () {
			this.collection.updateDocument(this);
		},

		afterWork : function (added, message) {

			if (!_.isUndefined(message.data.lines)) {
				this.lines = message.data.lines;
			}

			this.html = message.data.html;

			this.set({ length : message.data.length });

			if (this.isActivated() || added === true) {
				this.activate();
			}

			if (added === true) {
				this.trigger('change:added', this);
			}

		},

		getPrevious : function () {
			return this.collection.get(this.get('previous'));
		},

		getNext : function () {
			return this.collection.detect(function (model) {
				return model.get('previous') === this.id;
			}.bind(this));
		},

		getPath : function () {

			var ops = {
				union : '\u222a',
				intersection : '\u2229',
				difference : '\u2216',
				symmetric : '\u2296',
				grep : '*'
			}, path, m;

			for (path = [], m = this; m !== null; m = m.getPrevious()) {
				path.push(m.get('fileName'), ops[m.get('op')]);
			}
			path.pop();
			return path.reverse().join('');
		}

	});

	var TextPeer = Backbone.Collection.extend({

		model : Text,
		currentIndex : null,
		mask : /[1-9]\d{0,6}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/g,

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

		blend : function (op, file) {
			var m = new Text({
				op : op,
				origin : file,
				fileName : file.name,
				id : _.uniqueId('text')
			}, {
				collection : this,
				previous : this.currentDocument()
			});
			this.add(m);
		},

		sortDocument : function () {
			if (this.currentIndex) {
				this.currentDocument().sort();
			}
		},

		uniqDocument : function () {
			if (this.currentIndex) {
				this.currentDocument().uniq();
			}
		},

		currentDocument : function () {
			return this.get(this.currentIndex);
		}

	});

	return TextPeer;

});
