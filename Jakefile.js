/*global desc task jake*/
var fs = require('fs');
var crypto = require('crypto');
require('colors');

desc('build and push');
task('deploy', ['default', 'push'])

desc('build javascript/css');
task('default', ['clean', 'minify', 'templates'], function (params) {

	console.log('Compiling '.green + 'app scripts'.red.bold);

	var requirejs = require('requirejs');
	var config = {
		baseUrl        : './all/app/public/scripts',
		name           : 'main',
		excludeShallow : ['jquery', 'backbone'],
		mainConfigFile : './all/app/public/scripts/main.js',
		out            : 'all/app/public/scripts/production.js'
	};

	requirejs.optimize(config, function () {

		var shasum = crypto.createHash('sha1');

		var s = fs.ReadStream(config.out);
		s.on('data', function(d) {
			shasum.update(d);
		});

		s.on('end', function() {
			var version = shasum.digest('hex');
			fs.renameSync(config.out, config.out.replace('.js', '-' + version + '.js'));
			jake.Task.css.invoke(version);
			fs.writeFileSync(__dirname + '/all/version', version, 'utf8');
		});

	});


});

desc('uglify common scripts');
task('minify', function () {

	console.log('Compiling '.green + 'workers scripts'.red.bold);

	var jsp = require("uglify-js").parser;
	var pro = require("uglify-js").uglify;

	var scripts = [
		'all/app/public/scripts/workers/text-worker.js',
		'all/app/public/scripts/lib/operations.js'
	];

	scripts.forEach(function(file){
		var contents = fs.readFileSync(file, 'utf8');
		var ast = jsp.parse(contents);
		ast = pro.ast_mangle(ast);
		ast = pro.ast_squeeze(ast);
		var final_code = pro.gen_code(ast);
		fs.writeFileSync(file.replace('.js', '.min.js'), final_code, 'utf8');
	});


});

desc('push current directory tree to dotcloud');
task('push', function (params) {

	var sh = require('sh');
	// sh('dotcloud push --all zodiac');
	sh('jitsu deploy');

});

desc('render stylus files');
task('css', function (version) {

	console.log('Rendenring '.green + 'stylus files'.red.bold);

	var stylus = require('stylus');
	var str = fs.readFileSync('all/app/public/styles/style.styl', 'utf8');
	var filename = __dirname + '/all/app/public/styles/production-' + version + '.css';

	stylus(str)
	.include(require('nib').path)
	.set('filename', filename )
	.set('compress', true)
	.define('url', stylus.url({
		paths: [__dirname + '/all/app/public/images']
	}))
	.render(function (err, css) {
		if (err) throw err;
		fs.writeFileSync(filename, css, 'utf8');
	});

});


desc('compile dust templates');
task('templates', function  (params) {

	var dust = require('dustjs-linkedin');
	var list = new jake.FileList();
	list.include('all/app/public/scripts/templates/*html');

	var compiled = 'define(["dust"], function (dust){';

	list.toArray().forEach(function (v) {
		var file = fs.readFileSync(v, 'utf-8');
		var name = v.split('.')[0];
		console.log('Compiling '.green + v.red.bold);
		compiled += dust.compile(file, name.split('/').pop());
	});

	compiled += ' return dust; });';

	fs.writeFileSync('all/app/public/scripts/templates/templates.js', compiled, 'utf8');

});

desc('remove production files');
task('clean', function  (params) {

	console.log('Removing prodution files'.green);

	var list = new jake.FileList();
	list.include('all/app/public/scripts/production-*');
	list.include('all/app/public/styles/production-*');

	list.toArray().forEach(function (v) {
		fs.unlinkSync(v);
	});

});
