(function(){

	var Controller = Backbone.Router.extend({

		routes: {
			"view/:id": "view"
		},

		initialize: function(){

			new app.DropperView();
			new app.MaskView();

			// var shipments, listShipments, users, listUsers;
			
			// // create the contact collection
			// shipments = app.shipmentsCollection = new app.ShipmentCollection();
			// users = app.usersCollection = new app.UserCollection();
			
			// // kick off some views
			// // app.filterView = new app.FilterView({ collection: contacts });

			// listShipments = new app.ShipmentsListView({ collection: shipments });
			// listUsers = new app.UsersListView({ collection: users });
			// //new app.AddContactView({ model: new app.Contact });
			// new app.RenderModeView({ collection: shipments });
			// new app.ModeView();
			// // fetch data from server
			// shipments.fetch();
			// users.fetch();
			
			// // once all data is in, render the table
			// // and bind some more events on the model.
			// //listShipments.render();
			// //listShipments.ready();

		},

		view: function( id ){

			var model = app.shipmentsCollection.get( id );

			model && model.view.activate();

		}

		
	});

	// start the app
	
	app.controller = new Controller();

	Backbone.history.start();

})();
