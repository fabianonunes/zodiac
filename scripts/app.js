!function(){

	window.app = {};

	steal(
		'libs/jquery.min'
		, 'libs/worker_utils'
		, 'libs/underscore-min'
		, 'libs/backbone-min'
		, 'libs/dust-core-0.3.0.min'
	)
	.then('templates/path.js')
	.then('templates/details.js')
	.then(function(){

		app.template = function(data, template, el, cb){

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
		, 'views/mask'
		, 'views/input'
		, 'views/details'
		, 'views/path'
		, 'controllers/controller'
	);


}();
