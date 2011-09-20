
importScripts('libs/underscore-1.1.7.min.js');
importScripts('libs/dust-core-0.3.0.min.js');
importScripts('../templates/row-stream.js');

var TextWorker = {

	sort : function(lines, classes){

		var strut = []
		, last = { clazz : false }
		, base = dust.makeBase()
		, classes = classes || [];

		lines.forEach(function(v, k){
			if(!v) return;
			strut.push({
				line : v
				, clazz : classes[k]
			})
		});

		strut = sortBy(strut, 'line');

		template(strut, function(chunk, context, bodies) {

			var row = context.current();

			var ck = {
				line : row.line
				, clazz : row.clazz !== last.clazz && (last.clazz = row.clazz)
			};

			chunk.render(bodies.block, base.push(ck));

		}, function(out){
			postMessage({
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
	if(d.op === 'sort'){
		TextWorker.sort(d.lines, d.classes);
	} else {
		readFile(d.file, d.mask, TextWorker[d.op].bind(TextWorker, d.previous));
	}
}


function template(data, stream, cb){

	var streamed = '';

	dust.stream("row-stream", {
		data : data,
		stream : stream
	}).on("data", function(data){
		streamed += data;
	})
	.on("end", function(){
		cb(streamed);
	});

}

function readFile(file, mask, pmcb){
	var reader = new FileReader();
	reader.onload = function(event){
		var r = [];
		event.target.result.split('\n').forEach(function(v){
			v = mask ? mask.exec(v) : v.trim();
			if(v) r.push(v);
		});
		pmcb(r, event.target.result.trim());
	};
	reader.onerror = postMessage
	reader.readAsText(file);
}

function sortBy(obj, field, context){
	
	return obj.sort(function(left, right) {
		var a = left[field], b = right[field];
		return a < b ? -1 : a > b ? 1 : 0;
	});

}