
var fs = require('fs');
require('colors');

desc('Compile dust templates.');
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
