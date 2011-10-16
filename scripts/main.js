
require.config({
	paths: {
		// jQuery : 'libs/jquery/jquery',
		jquery : 'libs/jquery/jquery-1.7b2',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone',
		dust : 'libs/dust/dust'
	}
});

require(['app'], function(App){
	App.initialize();
});

