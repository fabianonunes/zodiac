
require.config({
	paths: {
		jquery : 'libs/jquery/jquery-1.7b2',
		underscore: 'libs/underscore',
		backbone: 'libs/backbone',
		dust : 'libs/dust'
	}
});

require(['app'], function(App){
	App.initialize();
});

