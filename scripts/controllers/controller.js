(function(){

	var Controller = Backbone.Router.extend({

		routes: {
			"view/:id": "view"
		},

		initialize: function(){

			this.documents = new app.TextPeer();

			new app.DropperView();
			new app.MaskView({
				collection: this.documents
			});

			var input = new app.InputView({
				collection : this.documents,
				router : this
			});

			this.documents.bind('change:currentIndex', function(index){
				this.navigate('view/' + index);
			}.bind(this));

		},

		view: function( id ){

			var model = this.documents.getByCid(id);
			if(!model){
				this.navigate('');
			} else {
				model.activate();
			}

		}

		
	});

	app.controller = new Controller();

	Backbone.history.start();

})();
