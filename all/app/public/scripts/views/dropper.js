/*global define*/
define([
	'jquery', 'backbone', 'underscore', 'lib/blob', 'lib/event'
], function ($, Backbone, _, blob, events) {

	var dropper = Backbone.View.extend({

		constructor : function DropperView () {
			return Backbone.View.apply(this, arguments)
		},

		events: {
			'dragover'        : 'cancel',
			'dragleave'       : 'leave',
			'dragenter'       : 'enter',
			'drop'            : 'drop',
			'dragleave .icon' : 'iconLeave',
			'dragenter .icon' : 'iconEnter',
			'drop .icon'      : 'iconDrop'
		},

		initialize: function () {
			_.bindAll(this)
			this.mask = $('.mask', this.el)
		},

		enter : function (evt) {
			this.mask.show()
			return this.cancel(evt)
		},

		iconEnter : function (evt) {
			$(evt.target).addClass('over')
		},

		leave : function (evt) {

			var related = events.elementFromCursor(evt)

			if (!related || related !== this.mask[0]) {
				var inside = $.contains(this.mask[0], related)
				if (!inside) this.mask.hide()
			}

		},

		iconLeave : function (evt) {

			var related = events.elementFromCursor(evt)

			if (!related || related !== evt.target) {
				var inside = $.contains(evt.target, related)
				if (!inside) $(evt.target).removeClass('over')
			}

		},

		iconDrop : function (evt) {

			this.cancel(evt)
			this.mask.hide()
			evt.stopImmediatePropagation()

			var target = $(evt.target).removeClass('over'),
				op     = target.attr('class').split(' ')[0],
				dt     = evt.originalEvent && evt.originalEvent.dataTransfer,
				file   = blob.createFromDataTransfer(dt)

			this.collection.blend(op, file)

		},

		drop : function (evt) {
			this.mask.hide()
			return this.cancel(evt)
		},

		cancel : events.cancel

	})

	return dropper

})
