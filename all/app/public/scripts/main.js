
require.config({
	paths : {
		jquery     : 'lib/vendor/jquery-1.7.2.min',
		backbone   : 'lib/vendor/backbone-0.9.2',
		underscore : 'lib/vendor/underscore',
		publisher  : 'lib/vendor/publisher-1.3.0',
		dust       : 'lib/vendor/dust-0.4.0'
	}
})

require(['app'], function (App) {
	App.initialize()
})
