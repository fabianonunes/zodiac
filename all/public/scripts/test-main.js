/*global mocha*/
require(['config'], function (config) {
	mocha.setup('bdd');
	require.config(config);
	require([
		'jquery', 'underscore',
		'test/spec/input.view', 'test/spec/dropper.view', 'test/spec/pathlist.view',
		'test/spec/model'
	], function($, _){
		mocha.runner = mocha.run()
		// mocha.reporters.TAP(mocha.runner)
	});
});
