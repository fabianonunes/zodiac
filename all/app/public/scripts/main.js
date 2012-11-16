
require.config({
	paths : {
		jquery     : 'lib/vendor/jquery-1.8.2.min',
		backbone   : 'lib/vendor/backbone-0.9.2',
		underscore : 'lib/vendor/underscore',
		publisher  : 'lib/vendor/publisher-2.0.0',
		dust       : 'lib/vendor/dust-1.1.1'
	}
})

require(['app'], function (App) {
	"use strict";
	App.initialize()
})
