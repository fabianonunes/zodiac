/*global define*/
define([
	'jquery', 'backbone', 'underscore', 'lib/blob', 'lib/event'
], function($, Backbone, _, blob, events) {

	var dropper = Backbone.View.extend({

		constructor : function DropperView () {
			return Backbone.View.apply(this, arguments);
		},

		events: {
			'dragover'		: 'cancel',
			'dragleave'		: 'dragLeave',
			'dragleave div'	: 'onLeave',
			'dragenter'		: 'dragEnter',
			'dragenter div'	: 'onEnter',
			'drop'			: 'onDrop'
		},

		initialize: function() {
			_.bindAll(this, 'dragEnter', 'dragLeave');
			this.mask = $('.mask', this.el);
		},

		dragEnter : function(evt) {
			this.mask.show();
			return this.cancel(evt);
		},

		onEnter : function(evt) {
			$(evt.target).addClass('over');
		},

		dragLeave : function(evt) {

			var related = events.elementFromCursor(evt);

			if(!related || related !== this.mask[0]) {
				var inside = $.contains(this.mask[0], related);
				if(!inside) this.mask.hide();
			}

		},

		onLeave : function(evt) {

			var related = events.elementFromCursor(evt);

			if(!related || related !== evt.target) {
				var inside = $.contains(evt.target, related);
				if(!inside) $(evt.target).removeClass('over');
			}

		},

		onDrop : function(evt) {

			this.cancel(evt);
			this.mask.hide();
			// evt.stopImmediatePropagation();

			var target = $(evt.target).removeClass('over'),
				op     = target.attr('class').split(' ')[0],
				dt     = evt.originalEvent.dataTransfer,
				file   = blob.createFromDataTransfer(dt);

			this.collection.blend(op, file);

		},

		cancel : events.cancel

	});

	return dropper;

});
