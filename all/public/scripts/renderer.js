/*global define*/
define(['dust'], function(dust){
	return function(data, template, el, cb){

		if(cb) cb = cb.bind(null, el);

		var s = document.createElement('span');

		dust.render(template, data, function(err, out) {

			s.innerHTML = out;

			el.appendChild(s);

			if(cb) cb();

		});

	};
});