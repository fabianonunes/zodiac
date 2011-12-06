
require.config({
	paths: {
		jquery     : 'libs/jquery/jquery-1.7.1',
		underscore : 'libs/underscore-1.2.2.min',
		backbone   : 'libs/backbone-0.5.3',
		dust       : 'libs/dust-0.3.0.min'
	}
});

require(['app'], function(App){
	App.initialize();
});

