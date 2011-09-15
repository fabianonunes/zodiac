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

		readFile : function(file, readFileCallback){

			var reader = new FileReader();

			reader.onload = readFileCallback.bind(null, file);

			reader.readAsText(file);

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

			var self = this
			, op = $(evt.currentTarget).attr('class').split(' ')[0]
			, dt = evt.originalEvent.dataTransfer
			, files = dt.files;

			this.cancel(evt);

			evt.stopImmediatePropagation();

			this.readFile(files[0], this.blend.bind(this, op));

			$(evt.target).removeClass('over');

			this.el.hide();

		},

		blend : function(op, file, event){
			var lines = event.target.result.split('\n').map(function(v){
				return v.trim();
			});
			this.collection.blend(file, lines, op);
		}
		
	});

}();
