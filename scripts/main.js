
require.config({
	paths: {
		jquery : 'libs/jquery/jquery-1.7.1',
		underscore: 'libs/underscore.min',
		backbone: 'libs/backbone',
		dust : 'libs/dust.min'
	}
});

require(['app'], function(App){
	App.initialize();
});

