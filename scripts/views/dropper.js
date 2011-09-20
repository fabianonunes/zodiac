!function(){

	app.DropperView = Backbone.View.extend({

		el: $('#dropper'),
		
		events: {
			
			'dragover' : 'cancel'
			// , 'dragover div' : 'cancel'

			, 'dragleave': 'dragLeave'
			, 'dragleave div' : 'onLeave'

			, 'dragenter' : 'dragEnter'
			, 'dragenter div' : 'onEnter'

			, 'drop' : 'onDrop' 

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

			var related = document.elementFromPoint(evt.clientX, evt.clientY);

			if(!related || related !== this.mask[0]){
				var inside = $.contains(this.mask[0], related);
				!inside && this.mask.hide();
			}

		},

		onLeave : function(evt){

			var related = document.elementFromPoint(evt.clientX, evt.clientY);

			if(!related || related !== evt.target){
				var inside = $.contains(evt.target, related);
				!inside && $(evt.target).removeClass('over');
			}
			
		},


		onDrop : function(evt){

			this.cancel(evt);
			evt.stopImmediatePropagation();
			
			var target = $(evt.target).removeClass('over')
			, op = target.attr('class').split(' ')[0]
			, dt = evt.originalEvent.dataTransfer;

			this.collection.blend(dt.files[0], op);

			this.mask.hide();

		},

		cancel : function(evt){
			if (evt.preventDefault) evt.preventDefault();
			// evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		}

	});

}();
