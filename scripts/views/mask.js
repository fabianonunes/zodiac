!function(){

	app.MaskView = Backbone.View.extend({

		el: $('.mask'),
		
		events: {

			'dragover' : 'cancel'
			, 'dragover div' : 'cancel'
			
			, 'dragleave div' : 'onLeave'
			, 'dragenter div' : 'onEnter'

			// a ordem dos eventos deve ser mantida do mais específico para o mais geral para que o stopImmediatePropagation funcione corretamente
			, 'drop div' : 'onDrop' 
			, 'drop' : 'onDrop'

		},
		
		initialize: function(){
			_.bindAll(this, 'onEnter', 'onDrop');
		},

		readFile : function(file, cb){

			return $.Deferred(function(defer){

				var reader = new FileReader();

				var r;

				reader.onload = function(event){
					defer.resolve(event.target.result);
				}

				reader.onerror = defer.reject;

				reader.readAsText(file);

			}).promise();

		},

		cancel : function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			// evt.originalEvent && (evt.originalEvent.dataTransfer.dropEffect = 'copy');
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

console.log(files);

			this.cancel(evt);

			evt.stopImmediatePropagation();

			this.readFile(files[0]).done(function(text){
				self.collection.blend(text, op);
			});

			$(evt.target).removeClass('over');

			this.el.hide();

		}
		
	});

}();
