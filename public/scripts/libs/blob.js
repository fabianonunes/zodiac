
define([
	'jquery',
	'underscore'
], function($, _){

	window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

	var blob = {};

	var createBlob = function(data){

		var path = _.uniqueId('selection_'),
			self = this,
			bb   = new BlobBuilder(),
			blob;

		bb.append(data);
		blob = bb.getBlob('text/plain');
		blob.name = path;

		return blob;

	};

	return function createFromDataTransfer (dataTransfer) {

		// accessing the files.length property directly is as expensive as plucking
		// file names. thus, its making use of pluck op to get both information
		var names = _.pluck(dataTransfer.files, 'name'),
			filesLength = names.length,
			file;

		if ( filesLength > 1 ) {
			file = createBlob(names.join('\n'));
		} else if ( filesLength === 0 ) {
			var type = _(dataTransfer.types).find(function(type){
				return ~type.indexOf('text/plain') || ~type.indexOf('text/html');
			});
			file = createBlob(dataTransfer.getData(type));
		} else {
			file = dataTransfer.files[0];
		}

		return file;

	};

});



