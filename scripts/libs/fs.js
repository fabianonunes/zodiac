
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder;
var fs = null;

function createFile(data){

	var dfd = $.Deferred()
	, path = _.uniqueId('selection_');

	truncateFile(path).then(function(){

		fs.root.getFile(path, { create: true }, function(fileEntry) {

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
	
}

function truncateFile(path){

	var dfd = $.Deferred();

	fs.root.getFile(path, { create: true }, function(fileEntry) {

		fileEntry.createWriter(function(fileWriter) {

			fileWriter.onwriteend = dfd.resolve;
			fileWriter.onerror = dfd.reject;

			fileWriter.truncate(0);

		}, errorHandler);

	}, errorHandler);
		

	return dfd.promise();
	
}

if (window.requestFileSystem) {
	initFS();
}

function initFS() {
	window.requestFileSystem(window.TEMPORARY, 5*1024*1024, function(filesystem) {
		fs = filesystem;
	}, errorHandler);
}

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
	};
	console.log('Error: ' + msg);
	console.trace();

}