/*global define*/

define([
	'lib/klass',
	'lib/blob'
], function (clazz, blob) {

	var BlobStore = clazz({
		write : function (data) {
			this.data = blob.createBlob(data);
		},
		read : function () {
			return blob.readBlob(this.data);
		}
	}).statics({
		factory : function () {
			return new BlobStore;
		}
	});

	return BlobStore;

});
