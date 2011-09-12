
importScripts('../libs/underscore-min.js');
importScripts('../libs/dust-full-0.3.0.min.js');

(function(){dust.register("tmpl-row-stream",body_0);function body_0(chk,ctx){return chk.write("<span>").section(ctx.get("data"),ctx,{"block":body_1},null).write("</span>");}function body_1(chk,ctx){return chk.section(ctx.get("stream"),ctx,{"block":body_2},null);}function body_2(chk,ctx){return chk.exists(ctx.get("clazz"),ctx,{"block":body_3},null).reference(ctx.get("line"),ctx,"h").write(" \n");}function body_3(chk,ctx){return chk.write("</span><span class=\"").reference(ctx.get("clazz"),ctx,"h").write("\">");}return body_0;})();

var TextWorker = {

	sort : function(lines, classes, cb){

		var strut = []
		, last = { clazz : false }
		, base = dust.makeBase();

		lines.forEach(function(v, k){
			if(!v) return;
			strut.push({
				line : v
				, clazz : classes[k]
			})
		});


		strut = _.sortBy(strut, function(v){ return v.line; });

		template(strut, function(chunk, context, bodies) {

			var row = context.current();

			var ck = {
				line : row.line
				, clazz : row.clazz !== last.clazz && (last.clazz = row.clazz)
			};

			chunk.render(bodies.block, base.push(ck));

		}, function(out){
			cb(out);
		});

	},

	difference : function(lines1, lines2, cb){

		var value = []
		, classes = []
		, uq = {}
		, last = {}
		, base = dust.makeBase();

		lines2.forEach(function(v, k){
			uq[v] = true;
		});

		template(lines1, function(chunk, context, bodies){
			var v = context.current();
			if(!uq[v]){
				var ck = {
					line : v
					, clazz : !last.clazz && (last.clazz = 'red')
				};
				chunk.render(bodies.block, base.push(ck));
				value.push(v);
				classes.push(last.clazz);
			}
		}, function(out){
			cb({
				html : out
				, lines : value
				, data : classes
			});				
		})

	},

	union : function(lines1, lines2, cb){

		var value = [] , classes = []
		, last = { clazz : false }
		, uq = {}, base = dust.makeBase();

		lines2.forEach(function(v){
			uq[v] = 'red';
		});
		lines1.forEach(function(v){
			uq[v] = [uq[v]] + 'blue';
		});

		template(Object.keys(uq), function(chunk, context, bodies) {

			var v = context.current();

			var ck = {
				line : v
				, clazz : uq[v] !== last.clazz && (last.clazz = uq[v])
			};

			chunk.render(bodies.block, base.push(ck));

			value.push(v);
			classes.push(uq[v]);

		}, function(out){
			cb({
				html : out
				, lines : value
				, data : classes
			});					
		});

	},

	intersection : function(lines1, lines2, cb){

		var value = [], classes = []
		, last = { clazz : false }
		, o = {} , base = dust.makeBase();

		lines2.forEach(function(v, k){
			o[v] = true;
		});

		template(lines1, function(chunk, context, bodies) {

			var v = context.current();

			if(o[v]){

				var ck = {
					line : v
					, clazz : !last.clazz && (last.clazz = 'redblue')
				};

				chunk.render(bodies.block, base.push(ck));

				value.push(v);
				classes.push(last.clazz);

			}

		}, function(out){
			cb({
				html : out
				, lines : value
				, data : classes
			});			
		});

	},

	symmetric : function(lines1, lines2, cb){
		var intersection = _.intersection(lines1, lines2);
		var union = _.union(lines1, lines2);
		var value = _.difference(union, intersection);
		var html = this.blame(value, lines1, lines2);
		dust.render("tmpl-row", {data:html}, function(err, out) {
			cb({
				html : out
				, data : html
				, lines : value
			});
		});
	}

};

onmessage = function(message){
	var d = message.data;
	d.args.push(postMessage);
	var r = TextWorker[d.op].apply(TextWorker, d.args);
}


function template(data, stream, cb){

	var streamed = '';

	dust.stream("tmpl-row-stream", {
		data : data,
		stream : stream
	}).on("data", function(data){
		streamed += data;
	})
	.on("end", function(){
		cb(streamed);
	});

}