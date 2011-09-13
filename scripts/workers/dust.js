
importScripts('../libs/dust-full-0.3.0.min.js');

var applyTemplate = function(data, name, template, cb){

	if(!dust.cache[name]){
		
		var compiled = dust.compile(
			template,
			name
		);

		dust.loadSource(compiled);

	}

	dust.render(name, data, function(err, out) {
		cb(out);
	});

}

onmessage = function(message){
	var d = message.data;
	var r = applyTemplate(d.data, d.name, d.template, postMessage);
}