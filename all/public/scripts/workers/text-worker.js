/*global self, FileReaderSync, importScripts */
importScripts('../lib/require.js')
require({
	baseUrl : '../lib'
}, ['operations'], function (operations) {

	self.onmessage = function (message) {

		var d = message.data,
			op = operations[d.op],
			data = op(self.readFile(d.previous), self.readFile(d.file, d.mask))

		self.postMessage(data)
			// self.BlobBuilder = self.WebKitBlobBuilder || self.MozBlobBuilder
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
	}

	self.readFile = function (file, mask, callback) {
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


})