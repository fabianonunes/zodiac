!function(){

	app.MaskView = Backbone.View.extend({

		el: $('.mask'),
		
		events: {
			'dragover' : 'cancel'
			, 'dragenter' : 'cancel'
			, 'drop' : 'drop'
			, 'dragover div.act' : 'cancel'
			, 'dragenter div.act' : 'actionEnter'
			, 'drop div.act' : 'actionDrop'
		},
		
		initialize: function(){
			_.bindAll(this, 'drop', 'actionEnter', 'actionDrop');
		},

		drop : function(evt){
			this.cancel(evt);
			this.el.hide();
		},

		cancel : function(evt){
			if (evt.preventDefault) evt.preventDefault();
			evt.originalEvent.dataTransfer.dropEffect = 'copy';
			return false;
		},

		actionEnter : function(evt){
			
			$('.act.over', this.el).removeClass('over');
			$(evt.target).addClass('over');
			return this.cancel(evt);
		},

		actionLeave : function(evt){
			evt.preventDefault();
			evt.stopPropagation();
			$(evt.target).removeClass('over');
			return false;
		},

		actionDrop : function(evt){
			$(evt.target).removeClass('over');
			this.el.hide();
		}

	});

}();
