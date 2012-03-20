/*global desc task jake*/
var fs = require('fs');
var crypto = require('crypto');
require('colors');

desc('build and push');
task('deploy', function (params) {
	jake.Task.build.invoke();
	jake.Task.push.invoke();
});

desc('build javascript/css');
task('build', function (params) {

	jake.Task.clean.invoke();
	jake.Task.minify.invoke();
	jake.Task.templates.invoke();

	console.log('Compiling '.green + 'app scripts'.red.bold);

	var requirejs = require('requirejs');
	var config = {
		baseUrl        : './all/public/scripts',
		name           : 'main',
		excludeShallow : ['lib/vendor/underscore-1.3.0.min', 'jquery', 'backbone'],
		mainConfigFile : './all/public/scripts/main.js',
		out            : 'all/public/scripts/production.js'
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
		'all/public/scripts/workers/text-worker.js',
		'all/public/scripts/lib/operations.js'
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
	var str = fs.readFileSync('all/public/styles/style.styl', 'utf8');
	var filename = __dirname + '/all/public/styles/production-' + version + '.css';

	stylus(str)
	.include(require('nib').path)
	.set('filename', filename )
	.set('compress', true)
	.define('url', stylus.url({
		paths: [__dirname + '/all/public/images']
	}))
	.render(function (err, css) {
		if (err) throw err;
		fs.writeFileSync(filename, css, 'utf8');
	});

});


desc('compile dust templates');
task('templates', function  (params) {

	var dust = require('dust');
	var list = new jake.FileList();
	list.include('all/public/scripts/templates/*html');

	var compiled = 'define(["dust"], function (dust){';

	list.toArray().forEach(function (v) {
		var file = fs.readFileSync(v, 'utf-8');
		var name = v.split('.')[0];
		console.log('Compiling '.green + v.red.bold);
		compiled += dust.compile(file, name.split('/').pop());
	});

	compiled += ' return dust; });';

	fs.writeFileSync('all/public/scripts/templates/templates.js', compiled, 'utf8');

});

desc('remove production files');
task('clean', function  (params) {

	console.log('Removing prodution files'.green);

	var list = new jake.FileList();
	list.include('all/public/scripts/production-*');
	list.include('all/public/styles/production-*');

	list.toArray().forEach(function (v) {
		fs.unlinkSync(v);
	});

});
