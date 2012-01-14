/*global define*/
define([
	'jquery', 'underscore', 'backbone', 'lib/jqmq'
], function ($, _, Backbone, jqmq) {

	var InputView = Backbone.View.extend({

		constructor : function InputView () {
			return Backbone.View.apply(this, arguments)
		},

		events : {
			'dblclick' : 'selectText'
		},

		initialize: function () {

			_.bindAll(this)

			this.collection.bind("change:currentIndex", this.updateText)
			this.collection.bind("reset", this.el.empty.bind(this.el))

			var self = this

			this.queue = jqmq({
				delay    : 50,
				callback : function jqmqCallback (text) {
					text = text || ''
					self.el[0].insertAdjacentHTML('beforeend', text)
				}
			})

		},

		selectText : function () {
			var range = document.createRange()
			range.selectNode(this.el[0])
			window.getSelection().addRange(range)
		},

		updateText : function (html, id) {

			var substr, i = 0, step = 10000

			this.queue.clear()
			this.el.empty()

			while ( (substr = html.substring(i, i + step)) ) {
				this.queue.add(substr)
				i += step
			}

		}

	})

	return InputView

})
