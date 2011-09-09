!function(){

	window.app = {};

	$LAB.setGlobalDefaults({
		AlwaysPreserveOrder:true,
		BasePath: 'scripts/'
	});

	$LAB
	.script('libs/jquery.min.js')
	.script('libs/jquery.jqote2.min.js')
	.script('libs/underscore-min.js')
	.script('libs/backbone-min.js')
	.script('libs/dust-full-0.3.0.min.js')
	.wait(function(){

		app.template = function(data, template, cb, end){

			if(!dust.cache[template]){
				
				var compiled = dust.compile(
					$('#' + template).html(),
					template
				);

				dust.loadSource(compiled);

			}

				// return $.Deferred(function(defer){
				// 	dust.stream(template, function(){
				// 		return {
				// 			data : function(chunk, context, bodies) {
				// 				console.log('chunks', arguments);
				// 			}
				// 			// data.data
				// 		}
				// 	}()).on("data", function(err, out) {
				// 		console.log(arguments);
				// 		defer.resolve(out);
		  // 				// append ? $(el).append($(out)) : $(el).html(out);
				// 	});
				// }).promise();
// console.log(data.data);
				dust.stream(template, {
					data : data.data, 
					stream : function(chunk, context, bodies) {
						return chunk.map(function(chunk){
							chunk.render(bodies.block, context).end();
						});
					}
				})
				.on("data", cb)
				.on("end", end);

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
