/*global define*/

define([
	'libs/klass',
	'libs/blob'
], function (Class, blob) {

	var BlobStore = Class({
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
