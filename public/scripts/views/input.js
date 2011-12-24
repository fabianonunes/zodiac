
define([
	'jquery', 'underscore', 'backbone', 'libs/jqmq'
], function ($, _, Backbone, jqmq) {

	var InputView = Backbone.View.extend({

		el: $('.input'),

		events : {
			'dblclick' : 'selectText'
		},

		initialize: function () {

			_.bindAll(this);

			this.collection.bind("change:currentIndex", this.updateText);
			this.collection.bind("reset", this.empty);

			var self = this;

			this.queue = jqmq({
				delay    : 25,
				batch    : 1,
				callback : function jqmqCallback (text) {
					text = text || '';
					self.el[0].insertAdjacentHTML(
						'beforeend',
						'<span>' + text + '</span>'
					);
				}
			});


		},

		selectText : function () {
			var range = document.createRange();
			range.selectNode(this.el[0]);
			window.getSelection().addRange(range);
		},

		updateText : function (id, model, html) {

			var substr, i = 0, step = 5000;

			this.queue.clear();
			this.empty();

			while( (substr = html.substring(i, i + step)) ){
				this.queue.add(substr);
				i += step;
			}

		},

		empty : function () {
			while (this.el[0].firstChild) {
				this.el[0].removeChild(this.el[0].firstChild);
			}
		}

	});

	return InputView;

});
