/*global mocha*/
require(['config'], function (config) {
	mocha.setup('bdd');
	require.config(config);
	require([
		'jquery', 'underscore', 'test/spec/model'
	], function($, _){
		mocha.runner = mocha.run()
		mocha.reporters.TAP(mocha.runner)
	});
});
