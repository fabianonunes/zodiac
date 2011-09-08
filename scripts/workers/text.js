
importScripts('../libs/underscore-min.js');

var TextWorker = {

	difference : function(lines1, lines2){
		var value = _.difference(lines1, lines2);
		value = _.compact(value).join('\n');
		return({value:value});
	},

	union : function(lines1, lines2){

		var value = _.union(lines1, lines2);

		var html = this.blame(value, lines1, lines2);

		return {
			value : value.join('\n')
			, lines : value
			, data : html
		};

	},

	intersection : function(lines1, lines2){

		var value = _.intersection(lines1, lines2);

		var html = this.blame(value, lines1, lines2);
		return {
			value : value.join('\n')
			, lines : value
			, data : html
		};
	},

	symmetric : function(lines1, lines2){
		var intersection = _.intersection(lines1, lines2);
		var union = _.union(lines1, lines2);
		var value = _.difference(union, intersection);
		value = _.compact(value).join('\n');
		return({value:value});
	},

	blame : function(result, op, opr){

		var r = result.map(function(line){

			var classe = '';
			classe += ~op.indexOf(line) ? 'red' : '';
			classe += ~opr.indexOf(line) ? 'blue' : '';

			return {
				classe: classe,
				line: line
			};

		});

		return _.sortBy(r, function(v){
			return v.line;
		});
		
	}

};

onmessage = function(message){
	var d = message.data;
	var r = TextWorker[d.op](d.lines1, d.lines2);
	postMessage(r);
}