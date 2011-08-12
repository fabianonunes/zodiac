/**
 * Table view
 */
(function(){

	app.UsersListView = Backbone.View.extend({

		el: $('#users tbody'),

		initialize: function(){
			
			_.bindAll(this, 'render', 'activate');
			var collection = this.collection;
			
			collection.bind('refresh', this.render);
			collection.bind('remove', this.render);

			// re-sort the collection when the last name changes.
			/*
			collection.bind('change:lastname', function( contact ){

				collection.sort();
				
				// re-open the contact that changed
				contact.view.activate();

			});
			*/
			
		},
		
		// once all the data has been loaded/created bind the add event.
		// otherwise, add will fire once for each record retreived & rendered.
		// fetch() will call refresh (already bound) and collection.create() 
		// will call render manually from the controller.
		ready: function(){
			this.collection.bind('add', this.render);
			this.collection.bind('add', this.activate);
		},

		// events
		
		render: function( model ){
			this.el.children().remove();
			this['render_' + this.collection.renderMode]();
		},
		
		render_default: function(){

			var el = this.el;

			this.collection.each(function( contact ){

				var view = new app.UserView({ model:contact }),
					row = view.render().el;
				
				el.append( row );

			});

		},
		
		//Grouping
		render_alpha: function(){

			var el		= this.el,
				self	= this,
				tmpl	= 'tmpl-orderby-letter',
				letter, header;

			this.collection.each(function( contact ){

				var view = new app.ShipmentView({ model: contact }),
					row = view.render().el,
					thisletter = view.model.get('sentAt');

				if( letter !== thisletter ){
					header = app.template(el, { letter: thisletter }, tmpl, true);
					letter = thisletter;
				}
				
				view.header = header;
				
				el.append( row );

			});

		},
		
		activate: function( contact ){
			contact.view.activate();
		}

	});
	
})();