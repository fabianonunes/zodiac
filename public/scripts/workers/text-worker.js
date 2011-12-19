
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

		template(strut, function (chunk, context, bodies) {

			var row = context.current();

			chunk.render(bodies.block, base.push({
				line : row.line
			}));

		}, function (out) {
			postMessage({
				html : out,
				length : strut.length
			});
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

		var value = [],
			uq = {},
			base = dust.makeBase();

		lines1.forEach(function (v, k) {
			uq[v] = true;
		});

		template(lines2, function (chunk, context, bodies) {
			var row = context.current();
			if(!uq[row]) {
				chunk.render(bodies.block, base.push({
					line : row
				}));
				value.push(row);
			}
		}, function (out) {
			postMessage({
				html : out,
				lines : value,
				length : value.length
			});
		});

	},

	union : function (lines2, lines1) {

		var value = lines1.concat(lines2),
			base = dust.makeBase();

		template(value, function (chunk, context, bodies) {

			chunk.render(bodies.block, base.push({
				line : context.current()
			}));

		}, function (out) {
			postMessage({
				html : out,
				lines : value,
				length : value.length
			});
		});

	},

	intersection : function (lines2, lines1) {

		var value = [],
			o = {},
			base = dust.makeBase();

		lines2.forEach(function (v, k) {
			o[v] = true;
		});

		template(lines1, function (chunk, context, bodies) {

			var v = context.current();

			if(o[v] === true) {

				// avoid duplicate lines
				o[v] = false;

				chunk.render(bodies.block, base.push({
					line : v
				}));

				value.push(v);

			}

		}, function (out) {
			postMessage({
				html : out,
				lines : value,
				length : value.length
			});
		});

	},

	symmetric : function (lines2, lines1) {

		var value = [],
			o = {},
			base = dust.makeBase();

		lines2.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		lines1.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		template(Object.keys(o), function (chunk, context, bodies) {

			var v = context.current();

			if(o[v] === 1) {

				chunk.render(bodies.block, base.push({
					line : v
				}));

				value.push(v);

			}

		}, function (out) {
			postMessage({
				html : out,
				lines : value,
				length : value.length
			});
		});

	},

	charge : function (lines2, lines1) {

		postMessage({
			html : lines1.join('\n'),
			lines : lines1,
			length : lines1.length
		});

	},

	grep : function (lines2, lines1) {

		var value = [],
			uq = {},
			base = dust.makeBase();

		var regexes = lines1.map(function (v) {
			return new RegExp(v, "i");
		});

		template(lines2, function (chunk, context, bodies) {

			var v, original;
			v = original = context.current();

			var found = regexes.some(function (r) {
				return v !== (v = v.replace(r, '<b>$&</b>'));
			});

			if(found) {

				chunk.render(bodies.block, base.push({
					line : v
				}));

				value.push(original);

			}

		}, function (out) {
			postMessage({
				html : out,
				lines : value,
				length : value.length
			});
		});

	}

};

onmessage = function (message) {

	var d = message.data,
		op = TextWorker[d.op];

	if(d.op === 'sort' || d.op === 'uniq') {
		op(d.lines, d.classes);
	} else if(d.op === 'grep') {
		readFile(d.file, null, op.bind(TextWorker, d.previous));
	} else {
		readFile(d.file, d.mask, op.bind(TextWorker, d.previous));
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
	callback(r);
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
