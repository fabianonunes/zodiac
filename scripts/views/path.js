define([
	'jquery', 'underscore', 'backbone', 'renderer', 'libs/fs'
], function ($, _, Backbone, renderer, fileSystem) {

	var PathView, PathListView;

	PathView = Backbone.View.extend({

		tagName : 'div',

		events : {
			'dragover'             : 'cancel',
			'dragleave'            : 'dragLeave',
			'dragenter'            : 'dragEnter',
			'drop'                 : 'onDrop',
			'drop .options .icon'  : 'onOpDrop',
			'click .remove'        : 'destroy',
			'click .icon'          : 'showOptions',
			'click .options .icon' : 'change',
			'mouseleave'           : 'hideOptions',
			'dragstart'            : 'onDrag'
		},

		template : 'path',

		initialize : function () {

			_.bindAll(this);

			this.model.bind('change:op', this.renderOp);
			this.model.bind('change:length', this.renderLength);

			this.element = $(this.el).attr('draggable', 'true');

			this.model.view = this;

			this._ = _.memoize(this.$);

		},

		hideOptions : function () {
			// this._('.options').stop().animate({ height : 0 });
		},

		showOptions : function () {
			var options = this._('.options');
			options.stop().animate({ height : options.prop('scrollHeight') });
		},

		dragEnter : function(evt) {
			this.showOptions();
			return this.cancel(evt);
		},

		onDrag : function (event) {
			event = event.originalEvent;
			event.dataTransfer.setData(
				'DownloadURL',
				'text/plain:' + this.model.getPath() +
					'.txt:data:text/plain;base64,' +
					window.btoa(this.model.lines.join('\n'))
			);
		},

		destroy : function () {
			this._ = null; // TODO: it's necesseray clear the memoized $ ?
			this.unbind();
			this.element.off().slideUp('fast', this.remove);
			this.model.destroy();
		},

		render : function () {

			var dfd = $.Deferred();

			renderer({
				documents : [this.model.attributes],
				ops : oprs
			}, this.template, this.el, dfd.resolve.bind(dfd, this.el));

			return dfd.promise();

		},

		renderOp : function (model, op) {
			this.$('.true').removeClass('true');
			this._('.row .icon').attr('class', 'icon ' + op);
			this._('.options .' + op).addClass('true');
		},

		renderLength : function (model, length) {
			this._('.counter')
				.text(length)
				.stop(true, true)
				.fadeOut('fast')
				.fadeIn('fast');
		},

		cancel : function(evt) {
			evt.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		},

		onDrop : function(evt) {
			this.hideOptions();
			this.cancel(evt);
		},

		onOpDrop : function (evt) {

			this.cancel(evt);
			// evt.stopImmediatePropagation();

			var target = $(evt.target).removeClass('over'),
				op = target.attr('class').split(' ')[0],
				dt = evt.originalEvent.dataTransfer,
				promise;

			// accessing the files.length property directly is as expensive as plucking
			// file names. thus, its making use of pluck op to get both information
			var names = _.pluck(dt.files, 'name');
			var filesLength = names.length;

			if ( filesLength > 1 ) {
				promise = fileSystem.createFile(names.join('\n'));
			} else if ( _(dt.types).contains('text') ) {
				promise = fileSystem.createFile(dt.getData('text'));
			} else {
				promise = $.Deferred().resolve(dt.files[0]);
			}

			promise.done(function(file){
				this.model.collection.blend(op, file, this.model.id);
			}.bind(this));

		},

		dragLeave : function(evt) {

			var related = document.elementFromPoint(
				evt.originalEvent.clientX,
				evt.originalEvent.clientY
			);

			if(!related || related !== this.el) {
				var inside = $.contains(this.el, related);
				if(!inside){
					this.hideOptions();
				}
			}

		},

		change : function (e) {
			var select = $(e.target),
				op = select.attr('class').split(' ')[0];
			this.model.set({ op : op });
			this.hideOptions();
		}

	});

	PathListView = Backbone.View.extend({

		el: $('.path'),
		template : 'path',

		initialize: function () {
			_.bindAll(this, 'render');
			this.collection.bind('change:added', this.render);
		},

		render : function (model) {

			var next = model.getNext();

			new PathView({ model : model })
			.render()
			.then(function (el) {
				var $el = $(el).hide();
				if(next){
					$el.insertBefore(next.view.el).slideDown('fast');
				} else {
					$el.appendTo(this.el).show();
				}
			}.bind(this));

		}

	});

	function oprs(chunk, context, bodies) {

		var ops = 'union intersection difference symmetric grep'.split(' ');
		var symbols = '\u222a \u2229 \u2216 \u2296 *'.split(' ');

		var document = context.current(), retval = [];

		return ops.map(function (v, k) {
			return {
				type     : v,
				symbol   : symbols[k],
				selected : document.op === v
			};
		});

	}

	return PathListView;

});


