(function(){

	var Controller = Backbone.Router.extend({

		routes: {
			"view/:id": "view"
		},

		initialize: function(){

			this.textPeer = new app.TextPeer();

			new app.DropperView();
			new app.MaskView({
				collection: this.textPeer
			});
			var input = new app.InputView({
				collection : this.textPeer,
				router : this
			});

			input.bind('updated', this.navigate);

		},



		view: function( id ){

			var model = this.textPeer.getByCid(id);

			model.activate();

		}

		
	});

	app.controller = new Controller();

	Backbone.history.start();

})();
