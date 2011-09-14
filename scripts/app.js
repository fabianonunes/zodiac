!function(){

	window.app = {};

	$LAB.setGlobalDefaults({
		AlwaysPreserveOrder : true,
		BasePath : 'scripts/'
	});

	$LAB
	.script('libs/jquery.min.js')
	.script('libs/worker_utils.js')
	.script('libs/underscore-min.js')
	.script('libs/backbone-min.js')
	.script('libs/dust-full-0.3.0.min.js')
	.wait(function(){

		app.template = function(data, template, el, cb){

			if(!dust.cache[template]){
				
				var compiled = dust.compile(
					$('#' + template).html(),
					template
				);
				dust.loadSource(compiled);
				console.log(compiled);

			}

			var s = document.createElement('span');
			dust.render(template, data, function(err, out) {
				s.innerHTML = out;
				el.appendChild(s);
				cb && cb();
			});

		};

	})
	.script('models/text.js')
	.script('views/dropper.js')
	.script('views/mask.js')
	.script('views/input.js')
	.script('views/details.js')
	.script('views/path.js')
	.script('controllers/controller.js');


}();
