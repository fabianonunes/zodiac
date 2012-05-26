/*global mocha*/

mocha.setup('bdd')

require.config({
	paths : {
		jquery     : 'lib/vendor/jquery-1.7.2.min',
		backbone   : 'lib/vendor/backbone-0.9.2',
		underscore : 'lib/vendor/underscore',
		publisher  : 'lib/vendor/publisher-1.3.0',
		dust       : 'lib/vendor/dust-0.3.0'
	}
})

require({
	paths : {
		expect : 'test/lib/expect-dom'
	}
},[
	'jquery', 'underscore',
	'test/spec/input.view', 'test/spec/dropper.view', 'test/spec/pathlist.view',
	'test/spec/model'
], function($, _){
	mocha.runner = mocha.run()
	// mocha.reporters.TAP(mocha.runner)
})
