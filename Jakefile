
var fs = require('fs');
require('colors');

desc('build and push');
task('deploy', function (params) {
	jake.Task.build.invoke();
	jake.Task.push.invoke();
});

desc('build javascript/css');
task('build', function (params) {

	console.log('Compiling '.green + 'app scripts'.red.bold);

	var requirejs = require('requirejs');

	var config = {
		baseUrl: 'scripts',
		name: 'main',
		excludeShallow : ['underscore', 'dust', 'templates'],
		paths: {
			jquery : 'libs/jquery/jquery-1.7',
			underscore: 'libs/underscore.min',
			backbone: 'libs/backbone',
			dust : 'libs/dust.min'
		},
		out: 'scripts/production.js'
	};

	requirejs.optimize(config, function () {});

	jake.Task.minify.invoke();
	jake.Task.templates.invoke();

});

desc('uglify common scripts');
task('minify', function () {

	console.log('Compiling '.green + 'workers scripts'.red.bold);

	var jsp = require("uglify-js").parser;
	var pro = require("uglify-js").uglify;

	var scripts = [
		'scripts/workers/text-worker.js',
		'scripts/libs/dust.js',
		'scripts/libs/underscore.js'
	];

	scripts.forEach(function(file){
		var contents = fs.readFileSync(file, 'utf8');
		var ast = jsp.parse(contents);
		ast = pro.ast_mangle(ast);
		ast = pro.ast_squeeze(ast);
		var final_code = pro.gen_code(ast);
		fs.writeFileSync(file.replace('.js', '.min.js'), final_code, encoding='utf8');
	});


});

desc('push current directory tree to dotcloud');
task('push', function (params) {

	var sh = require('sh');
	sh('dotcloud push --all zodiac');

});


desc('compile dust templates');
task('templates', function (params) {

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
