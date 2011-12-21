
importScripts('../libs/underscore-1.2.2.min.js');
importScripts('../libs/dust-0.3.0.min.js');
importScripts('../templates.js');

var TextWorker = {

	sort : function (lines) {

		var strut = [],
			base = dust.makeBase();

		lines.forEach(function (v, k) {
			if(!v) return;
			strut.push({
				line : v
			});
		});

		strut = sortBy(strut, 'line');

		strut.forEach(function (row) {

			chunk.render(bodies.block, base.push({
				line : row.line
			}));
		});

		postMessage({
			html : out,
			length : strut.length
		});

	},

	uniq : function (lines, classes) {

		var strut  = {},
			length = 0,
			base   = dust.makeBase();

		template(lines, function (chunk, context, bodies) {

			var value = context.current();

			if (value && !strut[value]) {

				strut[value] = true;

				chunk.render(
					bodies.block,
					base.push({ line : value })
				);

				length += 1;

			}

		}, function (out) {
			postMessage({
				html : out,
				length : length
			});
		});

	},

	difference : function (lines2, lines1) {

		var value = '',
			length = 0,
			uq = {},
			base = dust.makeBase();

		lines1.forEach(function (v, k) {
			uq[v] = true;
		});

		lines2.forEach(function (row) {
			if(!uq[row]) {
				value += row;
				value += '\n';
				length += 1;
			}
		});

		postMessage({
			lines : value,
			length : length
		});

	},

	union : function (lines2, lines1) {

		var value = lines1.concat(lines2),
			base = dust.makeBase();

		postMessage({
			lines : value.join('\n'),
			length : value.length
		});

	},

	intersection : function (lines2, lines1) {

		var value = '',
			length = 0,
			o     = {},
			base  = dust.makeBase();

		lines2.forEach(function (v, k) {
			o[v] = true;
		});

		lines1.forEach(function (v) {

			if(o[v] === true) {
				// avoid duplicate lines
				o[v] = false;
				value += row;
				value += '\n';
				length += 1;
			}

		});

		postMessage({
			lines : value,
			length : length
		});

	},

	symmetric : function (lines2, lines1) {

		var value = '',
			length = 0,
			o     = {},
			base  = dust.makeBase();

		lines2.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		lines1.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		Object.keys(o).forEach(function (v) {
			if(o[v] === 1) {
				value += row;
				value += '\n';
				length += 1;
			}
		});

		postMessage({
			lines : value,
			length : length
		});


	},

	charge : function (lines2, lines1) {

		// throw JSON.stringify({data:'asdf'});

		postMessage({
			lines : lines1.join('\n'),
			length : lines1.length
		});

	},

	grep : function (lines2, lines1) {

		var value = '',
			length = 0,
			uq = {},
			base = dust.makeBase();

		var regexes = lines1.map(function (v) {
			return new RegExp(v, "i");
		});

		lines2.forEach(function (original) {

			var v;
			v = original;

			var found = regexes.some(function (r) {
				return v !== (v = v.replace(r, '<b>$&</b>'));
			});

			if(found) {
				value += original;
				value += '\n';
				length += 1;
			}

		});

		postMessage({
			lines : value,
			length : length
		});

	}

};

onmessage = function (message) {

	var d = message.data,
		op = TextWorker[d.op];

	if(d.op === 'sort' || d.op === 'uniq') {
		op(d.lines, d.classes);
	} else if(d.op === 'grep') {
		op(readFile(d.previous), readFile(d.file));
	} else {
		op(readFile(d.previous), readFile(d.file, d.mask));
	}

};


function template(data, stream, cb) {

	var streamed = '';

	dust.stream("row-stream", {
		data : data,
		stream : stream
	}).on("data", function (data) {
		streamed += data;
	})
	.on("end", function () {
		cb(streamed);
	});

}

function readFile(file, mask, callback) {
	if(!file){
		return;
	}
	var reader = new FileReaderSync();
	var result = reader.readAsText(file);
	var r = [];
	result.split('\n').forEach(function (v) {
		v = v.trim();
		if (v) {
			if (mask) {
				Array.prototype.push.apply(r, v.match(mask));
			} else {
				r.push(v);
			}
		}
	});
	return r;
}

function sortBy(obj, field, context) {
	return obj.sort(function (left, right) {
		var a = left[field], b = right[field];
		return a < b ? -1 : a > b ? 1 : 0;
	});
}

function define(deps, module) {
	var root = this, args = [];
	deps.forEach(function (v) {
		args.push(this[v]);
	});
	module.apply(root, args);
}
