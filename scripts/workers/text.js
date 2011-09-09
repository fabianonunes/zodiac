
importScripts('../libs/underscore-min.js');

var TextWorker = {

	difference : function(lines1, lines2){
		var value = _.difference(lines1, lines2);
		var html = this.blame(value, lines1, lines2);
		return {
			data : html
			, lines : value
		};
	},

	union : function(lines1, lines2){
		var value = _.union(lines1, lines2);
		var html = this.blame(value, lines1, lines2);
		return {
			data : html
			, lines : value
		};
	},

	intersection : function(lines1, lines2){
		var value = _.intersection(lines1, lines2);
		var html = this.blame(value, lines1, lines2);
		return {
			data : html
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

		result.sort();

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
	var r = TextWorker[d.op](d.lines1, d.lines2);
	postMessage(r);
}