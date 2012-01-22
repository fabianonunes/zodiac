/*global define*/
define([
	'jquery', 'underscore', 'backbone'
], function ($, _, Backbone) {

	return Backbone.View.extend({

		constructor : function FooterView () {
			Backbone.View.apply(this, arguments)
		},

		events : {
			'click .uniq' : 'uniq',
			'click .sort' : 'sort',
			'click .dups' : 'dups',
			'dragstart .icon' : 'dragstart'
		},

		initialize: function () {
			_.bindAll(this)
			this.$('.icon').attr('draggable', 'true')
		},

		_op : function (op) {
			var last = this.options.collection.last()
			if(last) this.options.collection.blend(op)
		},

		uniq : function () {
			this._op('uniq')
		},

		sort : function () {
			this._op('sort')
		},

		dups : function () {
			this._op('dups')
		},

		dragstart : function (evt) {
			evt = evt.originalEvent
			var op = $(evt.target).attr('class').split(' ')[0]
			evt.dataTransfer.effectAllowed = 'link'
			evt.dataTransfer.setData(
				'url',
				'data:application/json,' + encodeURIComponent(JSON.stringify({
					op : op
				}))
			)
		}

	})

})
