
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
			cb({
				html : out
				, length : strut.length
			});
			close();
		});

	},

	difference : function(lines2, lines1){

		var value = []
		, classes = []
		, uq = {}
		, last = {}
		, base = dust.makeBase();

		lines1.forEach(function(v, k){
			uq[v] = true;
		});

		template(lines2, function(chunk, context, bodies){
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
			postMessage({
				html : out
				, lines : value
				, length : value.length
				// , data : classes
			});				
		})

	},

	union : function(lines2, lines1){

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
			postMessage({
				html : out
				, lines : value
				, length : value.length
				// , data : classes
			});					
		});

	},

	intersection : function(lines2, lines1){

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
			postMessage({
				html : out
				, lines : value
				, length : value.length
				// , data : classes
			});			
		});

	},

	symmetric : function(lines2, lines1){

		var value = [], classes = []
		, last = { clazz : false }
		, o = {} , base = dust.makeBase();

		lines2.forEach(function(v){
			o[v] = +[o[v]] + 1;
		});

		lines1.forEach(function(v){
			o[v] = +[o[v]] + 1;
		});		

		template(Object.keys(o), function(chunk, context, bodies) {

			var v = context.current();

			if(o[v] == 1){

				var ck = {
					line : v
					, clazz : !last.clazz && (last.clazz = 'redblue')
				};

				chunk.render(bodies.block, base.push(ck));

				value.push(v);
				classes.push(last.clazz);

			}

		}, function(out){
			postMessage({
				html : out
				, lines : value
				, length : value.length
				// , data : classes
			});			
		});

	},

	charge : function(lines2, lines1){
		
		postMessage({
			html : lines1.join('\n')
			, lines : lines1
			, length : lines1.length
		});					
	
	}

};

onmessage = function(message){
	var d = message.data;
	readFile(d.file, TextWorker[d.op].bind(TextWorker, d.previous));
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

function readFile(file, pmcb){
	var reader = new FileReader();
	reader.onload = function(event){
		var r = event.target.result.trim();
		pmcb(r.split('\n'), r);
	};
	reader.onerror = postMessage
	reader.readAsText(file);
}