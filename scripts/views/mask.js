!function(){

	app.MaskView = Backbone.View.extend({

		el: $('.mask'),
		
		events: {
			'dragover' : 'cancel'
			, 'dragenter' : 'cancel'
			, 'drop' : 'drop'
			, 'dragleave div' : 'actionLeave'
			, 'dragover div' : 'cancel'
			, 'dragenter div' : 'actionEnter'
			, 'drop div' : 'actionDrop'
		},
		
		initialize: function(){
			_.bindAll(this, 'drop', 'actionEnter', 'actionDrop');
		},

		drop : function(evt){

			var oEvt = evt.originalEvent
				, dt = oEvt.dataTransfer
				, files = dt.files
				, reader = new FileReader();

			reader.onload = function (event) {
				$('.input').text(event.target.result);
			};

			reader.readAsText(files[0]);			

			this.cancel(evt);
			this.el.hide();
			console.log(this.el);

		},

		cancel : function(evt){
			if (evt.preventDefault) evt.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		},

		actionEnter : function(evt){		
			$(evt.target).addClass('over');
			return this.cancel(evt);
		},

		actionLeave : function(evt){

			var related = document.elementFromPoint(evt.clientX, evt.clientY);

			if(related !== evt.target){
				var inside = $.contains(evt.target, related);
				!inside && $(evt.target).removeClass('over');
			}
			
		},

		actionDrop : function(evt){

			var evt = evt.originalEvent
			, dt = evt.dataTransfer
			, files = dt.files
			, reader = new FileReader();

			reader.onload = function (event) {

				var t = event.target.result.split('\n');
				var i = $('.input').text().split('\n');

				console.log(_.intersection(t, i));



			};

			reader.readAsText(files[0]);

			$(evt.target).removeClass('over');

			this.el.hide();

		}

	});

}();
