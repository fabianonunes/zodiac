!function(){

	app.MaskView = Backbone.View.extend({

		el: $('.mask'),
		
		events: {

			'dragover' : 'cancel'
			, 'dragover div' : 'cancel'
			
			, 'dragleave div' : 'onLeave'
			, 'dragenter div' : 'onEnter'

			// a ordem dos eventos deve ser mantida do mais específico
			// para o mais geral para que o stopImmediatePropagation
			// funcione corretamente
			, 'drop div' : 'onDrop' 
			, 'drop' : 'onDrop'

		},
		
		initialize: function(){
			_.bindAll(this, 'onEnter', 'onDrop');
		},

		cancel : function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			// evt.originalEvent && (evt.originalEvent.dataTransfer
			//.dropEffect = 'copy');
			return false;
		},

		onEnter : function(evt){
			$(evt.target).addClass('over');
		},

		onLeave : function(evt){

			var related = document.elementFromPoint(evt.clientX, evt.clientY);

			if(related !== evt.target){
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

			this.el.hide();

		}

	});

}();
