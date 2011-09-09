!function(){

	window.app = {};

	$LAB.setGlobalDefaults({
		AlwaysPreserveOrder:true,
		BasePath: 'scripts/'
	});

	$LAB
	.script('libs/jquery.min.js')
	.script('libs/worker_utils.js')
	.script('libs/underscore-min.js')
	.script('libs/backbone-min.js')
	.script('libs/dust-full-0.3.0.min.js')
	.wait(function(){

		app.template = function(data, template, cb){

			if(!dust.cache[template]){
				
				var compiled = dust.compile(
					$('#' + template).html(),
					template
				);

				dust.loadSource(compiled);

			}

			dust.render(template, data, function(err, out) {
				cb(out);
			});

			// dust.stream(template, {
			// 	data : data.data, 
			// 	stream : function(chunk, context, bodies) {
			// 		return chunk.map(function(chunk){
			// 			chunk.render(bodies.block, context).end();
			// 		});
			// 	}
			// })
			// .on("data", cb)
			// .on("end", end);

		};

	})
	.script('models/text.js')
	.script('views/dropper.js')
	.script('views/mask.js')
	.script('views/input.js')
	// .script('models/user.js')
	// .script('views/details.js')
	// .script('views/shipment.js')
	// .script('views/user.js')
	// .script('views/shipmentslist.js')
	// .script('views/userslist.js')
	// .script('views/rendermode.js')
	.script('controllers/controller.js');


}();
