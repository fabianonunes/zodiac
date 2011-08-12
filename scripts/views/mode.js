(function(){

	app.ModeView = Backbone.View.extend({

		el: $('navbar'),
		
		events: {
			'click .iconic': 'changeTab'
		},
		
		initialize: function(){
			_.bindAll(this, 'changeTab');
		},

		changeTab: function( event ){

			event.preventDefault();
			
			$('.main>.panel').hide();

			this.$('.button').removeClass('active');
			
			$(event.target).addClass('active');
			
			$(event.target.hash).show();

		},
		
		// events
		changeRendering: function( event ){

			$(event.target).toggleClass('view-list view-group');

			event.preventDefault();
			
			this.collection.renderMode = this.collection.renderMode === 'default' ?
				'alpha' :
				'default';
			
			// re-render and re-filter
			this.collection.fetch({
				success: function(){
					app.filterView.el.find('input').trigger('keyup');
				 }
			});

		}
		
	});

})();
