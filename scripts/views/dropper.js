
define([
	'jquery', 'backbone', 'underscore', 'libs/fs'
], function($, Backbone, _, fileSystem) {

	var dropper = Backbone.View.extend({

		el: $('.dropper'),

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

			var related = document.elementFromPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);

			if(!related || related !== this.mask[0]) {
				var inside = $.contains(this.mask[0], related);
				if(!inside) this.mask.hide();
			}

		},

		onLeave : function(evt) {

			var related = document.elementFromPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);

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

			promise.done(this.collection.blend.bind(this, op));

		},

		cancel : function(evt) {
			evt.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		}

	});

	return dropper;

});
