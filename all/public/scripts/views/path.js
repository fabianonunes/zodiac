/*global define*/
define([
	'jquery', 'underscore', 'backbone', 'renderer', 'publisher', 'lib/blob', 'lib/event'
], function ($, _, Backbone, renderer, publisher, blob, events) {

	var PathView = Backbone.View.extend({

		constructor : function PathView () {
			return Backbone.View.apply(this, arguments);
		},

		tagName : 'div',

		events : {
			'dragover'             : 'cancel',
			'dragenter'            : 'debouncedShow',
			'drop'                 : 'onDrop',
			'drop .options .icon'  : 'onOpDrop',
			'click .remove'        : 'untie',
			'click .icon'          : 'showOptions',
			'click .options .icon' : 'change'
			// 'dblclick'             : 'onDrag'
		},

		template : 'path',

		initialize : function () {

			_.bindAll(this);

			this.model.bind('change:op', this.renderOp);
			this.model.bind('change:length', this.renderLength);
			this.model.bind('destroy', this.destroy);

			this._            = _.memoize(this.$);
			this.element      = $(this.el).attr('draggable', 'true');
			this.subscription = publisher.subscribe('show', this.hideOptions);

		},

		hideOptions : function hideOptions (delay) {
			this.debouncedShow(false); // clear the debouncedShow timeout
			this._('.options')
				.stop(true)
				.delay(delay || 0)
				.animate({ height : 0 });
		},

		showOptions : function (delay) {

			publisher.publish('show', 400);

			var options = this._('.options');
			options.stop(true).delay(delay || 0).animate({
				height : options.prop('scrollHeight')
			});

		},

		// debouncing here, affects all instances
		debouncedShow : _.debounce(function debouncedShow (evt) {
			if(evt){
				this.showOptions(0);
				return this.cancel(evt);
			}
		}, 450),

		onDrag : function (event) {
			event = event.originalEvent || event;
			var m = this.model;
			var self = this;
			blob.downloadURL( m.lines, m.getPath() ).then(function (url) {
				var a = $('<a></a>');
				a.attr('href', 'data:text/plain;base64,4oiaDQo%3D');
				a.text('olá');
				a.appendTo(self.el);
			});
		},

		destroy : function () {
			this.unbind();
			this._ = null; // TODO: it's necesseray clear the memoized $ ?
			this.subscription.detach(); // TODO: is this enough to clear subscriptions ?
			this.element.off().slideUp('fast', this.remove);
		},

		untie : function () {
			this.model.destroy();
		},

		render : function () {
			return $.Deferred(function (dfd) {
				renderer({
					documents : [this.model.attributes],
					ops : PathView.oprs
				}, this.template, this.el, dfd.resolve.bind(dfd, this.el));
			}.bind(this));
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

		cancel : events.cancel,

		onDrop : function(evt) {
			this.hideOptions();
			this.cancel(evt);
		},

		onOpDrop : function (evt) {

			this.cancel(evt);

			var target = $(evt.target).removeClass('over'),
				op     = target.attr('class').split(' ')[0],
				dt     = evt.originalEvent.dataTransfer,
				file   = blob.createFromDataTransfer(dt);

			this.model.collection.blend(op, file, this.model.id);

		},

		change : function (evt) {
			var select = $(evt.target),
				op = select.attr('class').split(' ')[0];
			this.model.set({ op : op });
			this.hideOptions();
		}

	}, {

		oprs : function oprs (chunk, context, bodies) {

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

	});

	var PathListView = Backbone.View.extend({

		constructor : function PathListView () {
			return Backbone.View.apply(this, arguments);
		},

		template : 'path',
		events : {
			'dragleave' : 'dragLeave',
			'dragover'  : 'cancel',
			'drop'      : 'cancel'
		},

		initialize: function () {

			_.bindAll(this);
			this.collection.bind('change:added', this.render);

			this.contains = _.memoize(function (arg) {
				return $.contains(this.el[0], arg);
			}.bind(this), function (arg) {
				return arg.id || ( arg.id = _.uniqueId('anonymous_element') );
			});

		},

		render : function (model) {
			var index = this.collection.indexOf(model),
				view = new PathView({ model : model });
			view.render().then(this.addRow.bind(this, index));
		},

		addRow : function (index, el) {
			var $el = $(el).hide(),
			previous = this.$('>div').eq(index);
			if ( previous.length ) {
				$el.insertBefore(previous).slideDown('fast');
			} else {
				$el.appendTo(this.el).show();
			}
		},

		dragLeave : function(evt) {

			var related = events.elementFromCursor(evt);

			if(!related || related !== this.el) {
				if(!this.contains(related)){
					publisher.publish('show', 0); // forces all options to close at once
				}
			}

		},

		cancel : events.cancel

	});

	return PathListView;

});


