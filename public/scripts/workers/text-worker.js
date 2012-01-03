
var TextWorker = {

	sort : function (lines) {

		var value  = '',
			length = 0;

		var strut = lines.map(function (v) {
			return { line : v };
		});

		strut = sortBy(strut, 'line');

		strut.forEach(function (row) {
			value += row;
			value += '\n';
			length += 1;
		});

		postMessage({
			lines : value,
			length : length
		});

	},

	uniq : function (lines, classes) {

		var strut  = {},
			length = 0,
			value = '';

		lines.forEach(function (row) {

			if (row && !strut[row]) {
				strut[row] = true;
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

	difference : function (lines2, lines1) {

		var value = '',
			length = 0,
			uq = {};

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

		var value = lines1.concat(lines2);

		postMessage({
			lines : value.join('\n'),
			length : value.length
		});

	},

	intersection : function (lines2, lines1) {

		var value = '',
			length = 0,
			o     = {};

		lines2.forEach(function (v, k) {
			o[v] = true;
		});

		lines1.forEach(function (v) {

			if(o[v] === true) {
				// avoid duplicate lines
				o[v] = false;
				value += v;
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
			o     = {};

		lines2.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		lines1.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		Object.keys(o).forEach(function (v) {
			if(o[v] === 1) {
				value += v;
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
			uq = {};

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
