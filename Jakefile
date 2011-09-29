
var fs = require('fs');
require('colors');

desc('steal build javascript/css');
task('build', function (params) {

	var sh = require('sh');
	sh('git submodule init')
	.then('git submodule update')
	.then('steal/js steal/buildjs dev.html -to production');

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

	list.toArray().forEach(function(v){
		var file = fs.readFileSync(v, 'utf-8');
		var name = v.split('.')[0];
		console.log('Compiling '.green + v.red.bold);
		var compiled = dust.compile(file, name.split('/').pop());
		fs.writeFileSync(name+'.js', compiled, encoding='utf8');
	});

});
