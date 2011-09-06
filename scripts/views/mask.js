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

		readFile : function(file){

			return $.Deferred(function(defer){

				var reader = new FileReader();

				reader.onload = function(event){
					defer.resolve(event.target.result);
				}

				reader.onerror = defer.reject;

				reader.readAsText(file);

			}).promise();

		},

		cancel : function(evt){
			if (evt.preventDefault) evt.preventDefault();
			evt.stopPropagation();
			if(evt.originalEvent) evt.originalEvent.dataTransfer.dropEffect = 'copy';
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

			var evt = evt.originalEvent
			, dt = evt.dataTransfer
			, files = dt.files;

			this.readFile(files[0]).done(function(text){
				$('.input').html(text);
			});

			// reader.onload = function (event) {
			// 	var i = $('.input').text().split('\n');
			// 	var t = event.target.result.split('\n');
			// 	var n = _.intersection(t, i);
			// 	// $('.input').html(n.join("\n"));
			// };
			
			// reader.readAsText(files[0]);

			$(evt.target).removeClass('over');

			this.el.hide();

		}
		
	});

}();
