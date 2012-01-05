
require(['config'], function (config) {

	require.config(config);

	require(['app'], function (App) {
		App.initialize();
	});

});
