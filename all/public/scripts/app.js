
/*global define*/

define([
	'jquery',
	'templates/templates',
	'models/text',
	'views/dropper',
	'views/input',
	'views/path',
	'views/toolbar',
	'lib/blobstore',
	'lib/worker'
], function ($, dust, TextPeer, Dropper, Input, Path, Toolbar) {

	var app = {}

	app.initialize = function () {

		this.documents = new TextPeer([], {
			store : require('lib/blobstore').factory,
			performer : require('lib/worker').factory('/scripts/workers/text-worker.min.js')
		})

		var views = [
			new Dropper({
				collection: this.documents,
				el: $('.dropper')
			})
			, new Input({
				collection: this.documents,
				el: $('.input')
			})
			, new Path({
				collection: this.documents,
				el: $('.path')
			})
			, new Toolbar({
				collection: this.documents,
				el: $('.path footer')
			})
		]

	}

	return app

})
