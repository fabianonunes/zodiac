
importScripts('../libs/underscore-min.js');
importScripts('../libs/dust-full-0.3.0.min.js');

(function(){dust.register("tmpl-row",body_0);function body_0(chk,ctx){return chk.section(ctx.get("data"),ctx,{"block":body_1},null);}function body_1(chk,ctx){return chk.write("<span class=\"").reference(ctx.get("clazz"),ctx,"h").write("\">").section(ctx.get("rows"),ctx,{"block":body_2},null).write("</span>");}function body_2(chk,ctx){return chk.reference(ctx.getPath(true,[]),ctx,"h").write("\t").helper("sep",ctx,{"block":body_3},null);}function body_3(chk,ctx){return chk.write("\n");}return body_0;})();
(function(){dust.register("tmpl-row-stream",body_0);function body_0(chk,ctx){return chk.write("<span>").section(ctx.get("data"),ctx,{"block":body_1},null).write("</span>");}function body_1(chk,ctx){return chk.section(ctx.get("stream"),ctx,{"block":body_2},null);}function body_2(chk,ctx){return chk.exists(ctx.get("clazz"),ctx,{"block":body_3},null).reference(ctx.get("line"),ctx,"h").write(" \n");}function body_3(chk,ctx){return chk.write("</span><span class=\"").reference(ctx.get("clazz"),ctx,"h").write("\">");}return body_0;})();


var TextWorker = {

	sort : function(data, cb){

		var plain = [];

		data.forEach(function(stack){
			stack.rows.forEach(function(line){
				if(!line) return;
				plain.push({
					line : line,
					clazz : stack.clazz
				});
			});
		});

		plain = _.sortBy(plain, function(v){ return v.line; });

		var r = [];
		var last = {};

		plain.forEach(function(row){

			if(row.clazz !== last.clazz || !last.stack){
				last.stack = {
					clazz : row.clazz,
					rows : []
				}
				last.clazz = row.clazz;
				r.push(last.stack);
			}

			last.stack.rows.push(row.line);

		});

		dust.render("tmpl-row", {data:r}, function(err, out) {
			cb(out);
		});

	},

	difference : function(lines1, lines2, cb){
		var value = _.difference(lines1, lines2);
		var html = this.blame(value, lines1, lines2);
		dust.render("tmpl-row", {data:html}, function(err, out) {
			cb({
				html : out
				, data : html
				, lines : value
			});
		});
	},

	union : function(lines1, lines2, cb){
		var value = union(lines1, lines2);
		var html = this.blame(value, lines1, lines2);

		dust.render("tmpl-row", {data:html}, function(err, out) {
			cb({
				html : out
				, data : html
				, lines : value
			});
		});
		
	},

	intersection : function(lines1, lines2, cb){

		var streamed = '';
		var value = [];
		var lines = [];
		var o = {},
		last = {};

		dust.stream("tmpl-row-stream", {
			data : [lines1],
			stream : function(chunk, context, bodies) {

				var base = dust.makeBase();

				lines2.forEach(function(v, k){
					o[v] = true;
				});

				context.current().forEach(function(v){

					if(o[v]){

						value.push(v);

						var ck = {line : v};

						if(!last.clazz){
							ck.clazz = last.clazz = 'redblue';
						}

						chunk.render(bodies.block, base.push(ck));

					}

				});	

			}
		}).on("data", function(data){
			streamed += data;
		})
		.on("end", function(){
			cb({
				html : streamed
				, lines : value
			});			
		});

		// dust.render("tmpl-row", {data:html}, function(err, out) {
		// 	cb({
		// 		html : out
		// 		, data : html
		// 		, lines : value
		// 	});
		// });

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
	},

	blame : function(result, op, opr){

		var r = [];
		var last = {};

		result.forEach(function(line){

			//TODO: sort array and use the second argument of indexOf
			var clazz = ''
			clazz += ~op.indexOf(line) ? 'red' : '';
			clazz += ~opr.indexOf(line) ? 'blue' : '';

			if(clazz !== last.clazz || !last.stack){
				last.stack = {
					clazz : clazz,
					rows : []
				}
				last.clazz = clazz;
				r.push(last.stack);
			}

			last.stack.rows.push(line);

		});

		return r;

	}

};

onmessage = function(message){
	var d = message.data;
	d.args.push(postMessage);
	var r = TextWorker[d.op].apply(TextWorker, d.args);
}


function intersecion(arr1, arr2) {
	var r = [], o = {};

	arr2.forEach(function(v, k){
		o[v] = true;
	});

	arr1.forEach(function(v, k){
		o[v] && (r[r.length] = v);
	});	

	return r;
}

function union(lines1, lines2){
	var uq = {};
	lines1.forEach(function(v){
		uq[v] = true;
	});
	lines2.forEach(function(v){
		uq[v] = true;
	});
	return Object.keys(uq);
}

