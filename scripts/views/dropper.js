!function(){

	app.DropperView = Backbone.View.extend({

		el: $('#dropper'),
		
		events: {
			'dragover' : 'cancel'
			, 'dragenter' : 'dragEnter'
			, 'mouseleave div.mask' : 'dragLeave'
			, 'dragleave div.mask': 'dragLeave'
		},
		
		initialize: function(){
			_.bindAll(this, 'dragEnter', 'dragLeave');
			this.mask = $('.mask', this.el);
		},

		dragEnter : function(evt) {
			this.mask.show();
			return this.cancel(evt);
		},

		dragLeave : function(evt){

			var related = document.elementFromPoint(evt.clientX, evt.clientY);

			if(related !== this.mask[0]){
				var inside = $.contains(this.mask[0], related);
				console.log(this.mask[0], related, inside);
				!inside && this.mask.hide();				
			}


		},

		cancel : function(evt){
			if (evt.preventDefault) evt.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		}

	});

}();
