
require.config({
	paths : {
		jquery     : 'lib/vendor/jquery-1.7.1.min',
		backbone   : 'lib/vendor/backbone-0.9.1',
		underscore : 'lib/vendor/underscore',
		publisher  : 'lib/vendor/publisher-1.3.0',
		dust       : 'lib/vendor/dust-0.3.0'
	}
})

require(['app'], function (App) {
	App.initialize()
})
