
define([
	'jquery',
	'backbone',
	'underscore',
	'libs/fs'
], function($, Backbone, _, fs){

	var dropper = Backbone.View.extend({

		el: $('.dropper'),
		
		events: {
			
			'dragover' : 'cancel',
			// , 'dragover div' : 'cancel'

			'dragleave': 'dragLeave',
			'dragleave div' : 'onLeave',

			'dragenter' : 'dragEnter',
			'dragenter div' : 'onEnter',

			'drop' : 'onDrop' 

		},
		
		initialize: function(){
			_.bindAll(this, 'dragEnter', 'dragLeave');
			this.mask = $('.mask', this.el);
		},

		dragEnter : function(evt) {
			this.mask.show();
			return this.cancel(evt);
		},

		onEnter : function(evt){
			$(evt.target).addClass('over');
		},

		dragLeave : function(evt){

			var related = document.elementFromPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);

			if(!related || related !== this.mask[0]){
				var inside = $.contains(this.mask[0], related);
				if(!inside) this.mask.hide();
			}

		},

		onLeave : function(evt){

			var related = document.elementFromPoint(evt.originalEvent.clientX, evt.originalEvent.clientY);

			if(!related || related !== evt.target){
				var inside = $.contains(evt.target, related);
				if(!inside) $(evt.target).removeClass('over');
			}
			
		},

		onDrop : function(evt){

			var self = this;

			this.cancel(evt);
			evt.stopImmediatePropagation();
			
			var target = $(evt.target).removeClass('over'),
			op = target.attr('class').split(' ')[0],
			dt = evt.originalEvent.dataTransfer,
			type = dt.types[0];

			if(~dt.types.indexOf('text')){
				
				fs.createFile(dt.getData('text'))
					.then(self.collection.blend.bind(self, op));

			} else {
				this.collection.blend(op, dt.files[0]);
			}

			this.mask.hide();

		},

		cancel : function(evt){
			if (evt.preventDefault) evt.preventDefault();
			// evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		}

	});

	return dropper;

});
