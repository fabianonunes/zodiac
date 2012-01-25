/*global self, postMessage, onmessage:true, FileReaderSync */

self.BlobBuilder = self.WebKitBlobBuilder || self.MozBlobBuilder

var TextWorker = {

	sort : function (lines2) {

		var value  = '',
			length = 0;

		var strut = lines2.map(function (v) {
			return { line : v };
		});

		strut = sortBy(strut, 'line');

		strut.forEach(function (row) {
			value += row.line;
			value += '\n';
			length += 1;
		});

		return {
			lines : value,
			length : length
		}

	},

	uniq : function (lines2) {

		var strut  = {},
			length = 0,
			value = '';

		lines2.forEach(function (row) {

			if (!strut[row]) {
				strut[row] = true;
				value += row;
				value += '\n';
				length += 1;
			}

		});

		return {
			lines : value,
			length : length
		}

	},

	dups : function (lines2) {

		var value = '',
			length = 0,
			o = {};

		lines2.forEach(function (v) {
			o[v] = +[o[v]] + 1;
		});

		Object.keys(o).forEach(function (v) {
			if (o[v] > 1) {
				value += v;
				value += '\n';
				length += 1;
			}
		});

		return {
			lines : value,
			length : length
		}

	},

	difference : function (lines2, lines1) {

		var value = '',
			length = 0,
			uq = {},
			v;

		// lines1.forEach(function (v, k) {
		while ( (v = lines1.shift()) !== undefined ) {
			uq[v] = true;
		}
		// });

		// lines2.forEach(function (row) {
		while ( (v = lines2.shift()) !== undefined ) {
			if (!uq[v]) {
				value += v;
				value += '\n';
				length += 1;
			}
		}
		// });

		return {
			lines : value,
			length : length
		}

	},

	union : function (lines2, lines1) {

		var value = lines1.concat(lines2);

		return {
			lines : value.join('\n'),
			length : value.length
		}

	},

	intersection : function (lines2, lines1) {

		var value = '',
			length = 0,
			o     = {}, v;

		// lines2.forEach(function (v, k) {
		while ( (v = lines2.shift()) !== undefined ) {
			o[v] = true;
		}
		// });

		// lines1.forEach(function (v) {
		while ( (v = lines1.shift()) !== undefined ) {
			if (o[v] === true) {
				// avoid duplicate lines
				o[v] = false;
				value += v;
				value += '\n';
				length += 1;
			}
		}
		// });

		return {
			lines : value,
			length : length
		}

	},

	symmetric : function (lines2, lines1) {

		var value = '',
			length = 0,
			o = {},
			v;

		// lines2.forEach(function (v) {
		while ( (v = lines2.shift()) !== undefined ) {
			o[v] = +[o[v]] + 1;
		}
		// });

		// lines1.forEach(function (v) {
		while ( (v = lines1.shift()) !== undefined ) {
			o[v] = +[o[v]] + 1;
		}
		// });

		var keys = Object.keys(o)
		// keys.forEach(function (v) {
		while ( (v = keys.shift()) ) {
			if (o[v] === 1) {
				value += v;
				value += '\n';
				length += 1;
			}
		}
		// });

		return {
			lines : value,
			length : length
		}


	},

	charge : function (lines2, lines1) {

		return {
			lines : lines1.join('\n'),
			length : lines1.length
		}

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

			if (found) {
				value += original;
				value += '\n';
				length += 1;
			}

		});

		return {
			lines : value,
			length : length
		}

	}

};

onmessage = function (message) {

	var d = message.data,
		op = TextWorker[d.op],
		data = op(readFile(d.previous), readFile(d.file, d.mask))

	postMessage(data)

		// if ('undefined' !== typeof self.BlobBuilder) {
		// var bb = new self.BlobBuilder()
		// bb.append(data.lines)
		// data.lines = bb.getBlob('text/plain')
		// } else {
		// var idx, len = lines.length, arr = new Array( len );
		// for ( idx = 0 ; idx < len ; ++idx ) {
		// arr[ idx ] = lines.charCodeAt(idx) & 0xFF;
		// }
		// lines = new Uint8Array( arr ).buffer
		// }


};

function readFile (file, mask, callback) {
	if (!file){
		return null;
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

function sortBy (obj, field, context) {
	return obj.sort(function (left, right) {
		var a = parseInt(left[field], 10), b = parseInt(right[field], 10);
		return a < b ? -1 : a > b ? 1 : 0;
	});
}