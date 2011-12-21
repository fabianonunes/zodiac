
define([
	'jquery', 'underscore', 'backbone'
], function ($, _, Backbone) {

	var InputView = Backbone.View.extend({

		el: $('.input'),

		events : {
			'dblclick' : 'selectText'
		},

		initialize: function () {

			_.bindAll(this);

			this.collection.bind("change:currentIndex", this.updateText);
			this.collection.bind("reset", this.empty);

		},

		selectText : function () {
			var range = document.createRange();
			range.selectNode(this.el[0]);
			window.getSelection().addRange(range);
		},

		updateText : function (id, model, html) {

			var self = this;

			_.defer(function () {
				self.el.empty();
				html = html || '';
				self.el[0].insertAdjacentHTML(
					'beforeend',
					'<span>' + html + '</span>'
				);
			});

		},

		empty : function () {
			while (this.el[0].firstChild) {
				this.el[0].removeChild(this.el[0].firstChild);
			}
		}

	});

	return InputView;

});
