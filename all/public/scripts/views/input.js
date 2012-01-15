/*global define*/
define([
	'jquery', 'underscore', 'backbone', 'lib/jqmq'
], function ($, _, Backbone, jqmq) {

	return Backbone.View.extend({

		constructor : function InputView () {
			return Backbone.View.apply(this, arguments)
		},

		events : {
			'dblclick' : 'selectText'
		},

		initialize: function (options) {

      var self = this

			_.bindAll(this)

			this.collection.bind( 'change:currentIndex', _.proxy('updateText', this) )
			this.collection.bind( 'reset', _.proxy('empty', this.el) )

			this.queue = jqmq({
				delay    : 50,
				callback : this._injectHtml
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
		},

    _injectHtml : function _injectHtml (text) {
        text = text || ''
        this.el[0].insertAdjacentHTML('beforeend', text)
    }

	})

})
