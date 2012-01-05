
/*global define*/

define([
	'jquery',
	'templates',
	'models/text',
	'views/dropper',
	'views/input',
	'views/path',
	'views/toolbar',
	'libs/blobstore',
	'libs/worker'
], function ($, dust, TextPeer, Dropper, Input, Path, Toolbar, BlobStore, Worker) {

	var app = {};

	app.initialize = function () {

		this.documents = new TextPeer([], {
			store : BlobStore.factory,
			performer : Worker.factory('/scripts/workers/text-worker.min.js')
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