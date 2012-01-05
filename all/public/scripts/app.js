
/*global define*/

define([
	'jquery',
	'templates',
	'models/text',
	'views/dropper',
	'views/input',
	'views/path',
	'views/toolbar',
	'libs/blobstore'
], function ($, dust, TextPeer, Dropper, Input, Path, Toolbar, BlobStore) {

	var app = {};

	app.initialize = function () {

		this.documents = new TextPeer([], {
			store : BlobStore.factory
		});

		new Dropper({
			collection: this.documents
		});
		new Input({
			collection: this.documents
		});

		new Path({
			collection: this.documents,
			el: $('.path')
		});

		new Toolbar({
			collection: this.documents
		});


	};

	return app;

});
