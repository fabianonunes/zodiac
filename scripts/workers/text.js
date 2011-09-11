
importScripts('../libs/underscore-min.js');

var TextWorker = {

	sort : function(data){

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

		return { data : r };

	},

	difference : function(lines1, lines2){
		var value = _.difference(lines1, lines2);
		var html = this.blame(value, lines1, lines2);
		return {
			data : html
			, lines : value
		};
	},

	union : function(lines1, lines2){
var dt = Date.now();		
		var value = union(lines1, lines2);
var t = Date.now() - dt;			
		var html = this.blame(value, lines1, lines2);
		return {
			t : t
			, data : html
			, lines : value
		};
	},

	intersection : function(lines1, lines2){
var dt = Date.now();		
		// var value = _.intersection(lines1, lines2);
		var value = intersecion(lines1, lines2);
var t = Date.now() - dt;
		var html = this.blame(value, lines1, lines2);
		return {
			t : t
			, data : html
			, lines : value
		};
	},

	symmetric : function(lines1, lines2){
		var intersection = _.intersection(lines1, lines2);
		var union = _.union(lines1, lines2);
		var value = _.difference(union, intersection);
		var html = this.blame(value, lines1, lines2);
		return {
			data : html
			, lines : value
		};
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
	var r = TextWorker[d.op].apply(TextWorker, d.args);
	postMessage(r);
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

