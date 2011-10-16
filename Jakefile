
var fs = require('fs');
require('colors');

desc('build javascript/css');
task('build', function (params) {

	var requirejs = require('requirejs');

	var config = {
		baseUrl: 'scripts',
		name: 'main',
		excludeShallow : ['underscore', 'dust'],
		paths: {
			jquery : 'libs/jquery/jquery-1.7b2',
			underscore: 'libs/underscore',
			backbone: 'libs/backbone',
			dust : 'libs/dust'
		},
		out: 'scripts/main-built.js'
	};

	requirejs.optimize(config, function (buildResponse, a, b, c, d) {
		var contents = fs.readFileSync(config.out, 'utf8');
	});

});

desc('push current directory tree to dotcloud');
task('push', function (params) {

	var sh = require('sh');
	sh('dotcloud push --all zodiac');

});


desc('compile dust templates');
task('compile-templates', function (params) {

	var dust = require('dust');
	var list = new jake.FileList();
	list.include('scripts/templates/*html');

	var compiled = 'define(["dust"], function (dust){';

	list.toArray().forEach(function(v){
		var file = fs.readFileSync(v, 'utf-8');
		var name = v.split('.')[0];
		console.log('Compiling '.green + v.red.bold);
		compiled += dust.compile(file, name.split('/').pop());
	});

	compiled += ' return dust; });';

	fs.writeFileSync('scripts/templates.js', compiled, encoding='utf8');

});
