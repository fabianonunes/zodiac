
define([
	'underscore',
	'templates',
	'models/text',
	'views/dropper',
	'views/input',
	'views/path'
], function (_, dust, TextPeer, Dropper, Input, Path) {

	var app = {};

	app.initialize = function () {

		this.documents = new TextPeer();

		new Dropper({
			collection: this.documents
		});
		new Input({
			collection: this.documents
		});
		new Path({
			collection: this.documents
		});

	};

	return app;

});
