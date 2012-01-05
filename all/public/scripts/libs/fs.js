
define([
	'jquery',
	'underscore'
], function($, _){

	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;

	var fs = {};

	fs.initialize = function(){

		var self = this;

		if (window.requestFileSystem) {
			window.requestFileSystem(window.TEMPORARY, 5*1024*1024, function(filesystem) {
				self.filesystem = filesystem;
			}, errorHandler);
		}

	};

	fs.createFile = function(data){

		var dfd = $.Deferred(),
		path = _.uniqueId('selection_'),
		self = this;

		this.truncateFile(path).then(function(){

			self.filesystem.root.getFile(path, { create: true }, function(fileEntry) {

				fileEntry.createWriter(function(writer) {

					writer.onwriteend = fileEntry.file.bind(fileEntry, dfd.resolve);

					writer.onerror = dfd.reject;

					var bb = new BlobBuilder();
					bb.append(data);
					writer.write(bb.getBlob('text/plain'));

				}, errorHandler);

			}, errorHandler);

		});

		return dfd.promise();

	};

	fs.truncateFile = function(path){

		var dfd = $.Deferred();

		fs.filesystem.root.getFile(path, { create: true }, function(fileEntry) {

			fileEntry.createWriter(function(fileWriter) {

				fileWriter.onwriteend = dfd.resolve;
				fileWriter.onerror = dfd.reject;

				fileWriter.truncate(0);

			}, errorHandler);

		}, errorHandler);

		return dfd.promise();

	};

	function errorHandler(e) {
		var msg = '';
		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
				msg = 'QUOTA_EXCEEDED_ERR';
				break;
			case FileError.NOT_FOUND_ERR:
				msg = 'NOT_FOUND_ERR';
				break;
			case FileError.SECURITY_ERR:
				msg = 'SECURITY_ERR';
				break;
			case FileError.INVALID_MODIFICATION_ERR:
				msg = 'INVALID_MODIFICATION_ERR';
				break;
			case FileError.INVALID_STATE_ERR:
				msg = 'INVALID_STATE_ERR';
				break;
			default:
				msg = 'Unknown Error';
				break;
		}

		console.log('Error: ' + msg);
		console.trace();

	}

	fs.initialize();

	return fs;

});



