!function(){

	window.app = {};

	steal(
		'libs/jquery-1.6.4'
		, 'libs/worker-utils'
		, 'libs/underscore-1.1.7'
		, 'libs/backbone-0.5.3'
		, 'libs/dust-core-0.3.0'
	)
	.then('templates/path.js')
	.then(function(){

		app.template = function(data, template, el, replace, cb){

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
				
				replace && $(el).empty();

				el.appendChild(s);

				cb && cb();

			});

		};

	}).then(
		'models/text'
		, 'views/dropper'
		, 'views/mask'
		, 'views/input'
		, 'views/path'
		, 'controllers/controller'
	);


}();
