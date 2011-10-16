
require.config({
	paths: {
		jquery : 'libs/jquery/jquery-1.7b2',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone',
		dust : 'libs/dust/dust'
	}
});

require([
	'app'
], function(App){
	App.initialize();
});

