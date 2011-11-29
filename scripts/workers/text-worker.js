
importScripts('../libs/underscore.min.js');
importScripts('../libs/dust.min.js');
importScripts('../templates.js');

var TextWorker = {

	sort : function (lines) {

		var strut = [],
			last = { clazz : false },
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

		var strut = {},
			last = { clazz : false },
			base = dust.makeBase(),
			value = [];

		lines.forEach(function (v, k) {
			if(!v) return;
			strut[v] = 0;
		});

		template(Object.keys(strut), function (chunk, context, bodies) {

			var row = context.current();

			chunk.render(bodies.block, base.push({
				line : row
			}));

			value.push(row);

		}, function (out) {
			postMessage({
				html : out,
				length : value.length
			});
		});


	},

	difference : function (lines2, lines1) {

		var value = [],
			uq = {},
			last = {},
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

		var value = [],
		uq = {}, base = dust.makeBase();

		lines2.forEach(iterator(uq));
		lines1.forEach(iterator(uq));

		template(lines1.concat(lines2), function (chunk, context, bodies) {

			var v = context.current();

			chunk.render(bodies.block, base.push({
				line : v
			}));
			value.push(v);

		}, function (out) {
			postMessage({
				html : out,
				lines : value,
				length : value.length
			});
		});

	},

	intersection : function (lines2, lines1) {

		var value = [], classes = [],
		last = { clazz : false },
		o = {} , base = dust.makeBase();

		lines2.forEach(function (v, k) {
			o[v] = true;
		});

		template(lines1, function (chunk, context, bodies) {

			var v = context.current();

			if(o[v]) {

				var ck = {
					line : v,
					clazz : !last.clazz && (last.clazz = 'redblue')
				};

				chunk.render(bodies.block, base.push(ck));

				value.push(v);
				classes.push(last.clazz);

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

		var value = [], classes = [],
		last = { clazz : false },
		o = {} , base = dust.makeBase();

		lines2.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		lines1.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		template(Object.keys(o), function (chunk, context, bodies) {

			var v = context.current();

			if(o[v] === 1) {

				var ck = {
					line : v,
					clazz : !last.clazz && (last.clazz = 'redblue')
				};

				chunk.render(bodies.block, base.push(ck));

				value.push(v);
				classes.push(last.clazz);

			}

		}, function (out) {
			postMessage({
				html : out,
				lines : value,
				length : value.length
				// , data : classes
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
		classes = [],
		last = { clazz : false },
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

				var ck = {
					line : v
					// , clazz : !last.clazz && (last.clazz = 'red')
				};

				chunk.render(bodies.block, base.push(ck));
				value.push(original);
				classes.push(uq[v]);

			}

		}, function (out) {
			postMessage({
				html : out,
				lines : value,
				length : value.length
				// , data : classes
			});
		});

	}

};

onmessage = function (message) {

	var d = message.data;

	if(d.op === 'sort' || d.op === 'uniq') {
		TextWorker[d.op](d.lines, d.classes);
	} else if(d.op === 'grep') {
		readFile(d.file, null, TextWorker[d.op].bind(TextWorker, d.previous));
	} else {
		readFile(d.file, d.mask, TextWorker[d.op].bind(TextWorker, d.previous));
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
		if(mask) (v = mask.exec(v));
		if(v) r.push(v.toString().trim());
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
