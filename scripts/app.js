!function(){

	window.app = {};

	steal(
		'libs/jquery-1.6.4'
		, 'libs/base64'
		, 'libs/worker-utils'
		, 'libs/underscore-1.1.7'
		, 'libs/backbone-0.5.3'
		, 'libs/dust-core-0.3.0'
		, 'libs/fs.js'
	)
	.then('templates/path.js')
	.then(function(){

		app.template = function(data, template, el, cb){

			cb && (cb = cb.bind(null, el));

			if(!dust.cache[template]){
				
				var compiled = dust.compile(
					$('#' + template).html(),
					template
				);
				dust.loadSource(compiled);

			}

			var s = document.createElement('span');
			
			dust.render(template, data, function(err, out) {

				s.innerHTML = out;
				
				el.appendChild(s);

				cb && cb();

			});

		};

	}).then(
		'models/text'
		, 'views/dropper'
		, 'views/input'
		, 'views/path'
		, 'controllers/controller'
	);


}();
