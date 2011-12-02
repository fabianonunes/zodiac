define([
	'jquery', 'underscore', 'backbone', 'renderer'
], function ($, _, Backbone, renderer) {

	var PathView, PathListView;

	PathView = Backbone.View.extend({

		tagName : 'div',

		events : {
			'click .remove' : 'destroy',
			'click .icon'   : 'click',
			'dragstart'     : 'drag'
		},

		template : 'path',

		initialize : function () {

			_.bindAll(this, 'render', 'destroy', 'click', 'renderOp', 'renderLength');

			this.model.bind('change:op', this.renderOp);
			this.model.bind('change:length', this.renderLength);

			this.element = $(this.el).attr('draggable', 'true');

			this.model.view = this;

		},

		click : function (evt) {

			this.element.parent().find('.options').css({height : 0});

			var options = this.$('.options');
			options.show().css({
				height : options.height() > 0 ? 0 : options[0].scrollHeight
				// height : options[0].scrollHeight
			});

		},

		drag : function (event) {
			event = event.originalEvent;
			event.dataTransfer.setData(
				'DownloadURL',
				'text/plain:' + this.model.getPath() +
					'.txt:data:text/plain;base64,' +
					window.btoa(this.model.lines.join('\n'))
			);
		},

		destroy : function () {
			this.unbind();
			this.remove();
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
			this.$('.row .icon').attr('class', 'icon ' + op);
			this.$('.true').removeClass('true');
			this.$('.options .' + op).addClass('true');
		},

		renderLength : function (model, length) {
			this.$('.counter').text(length).stop(true, true).fadeOut('fast').fadeIn('fast');
		}

	});

	PathListView = Backbone.View.extend({

		el: $('.path'),
		template : 'path',

		events : {
			'click .options .icon' : 'change'
		},

		initialize: function () {
			_.bindAll(this, 'render', 'change');
			this.collection.bind('change:added', this.render);
		},

		change : function (e) {
			var select = $(e.target),
				op = select.attr('class').split(' ')[0],
				id = select.text();
			this.collection.get(id).set({ op : op });
		},

		render : function (model) {
			new PathView({ model : model })
				.render()
				.then(this.el.append.bind(this.el));
		},

		empty : function () {
			while (this.el[0].firstChild) {
				this.el[0].removeChild(this.el[0].firstChild);
			}
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


