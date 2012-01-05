(function () {

	var Controller = Backbone.Router.extend({

		routes: {
			"view/:id": "view"
		},

		initialize: function () {

			this.documents = new app.TextPeer();

			new app.DropperView({
				collection: this.documents
			});

			new app.InputView({
				collection : this.documents,
				router : this
			});

			new app.PathListView({
				collection : this.documents
			});

			this.documents.bind('change:currentIndex', function (index) {
				this.navigate('view/' + index);
			}.bind(this));

		},

		view: function (id) {
			var model = this.documents.get(id);
			if (model) {
				model.activate();
			} else {
				this.navigate('');
			}
		}

	});

	app.controller = new Controller();

	Backbone.history.start();

}());
