/*global define, blob*/
define([
	'lib/q',
	'underscore',
	'jquery'
], function(q, _, $){

	"use strict";

	var blob = {}

	blob.createBlob = function createBlob (data) {

		var path = _.uniqueId('selection_'),
			blob = new Blob([data], { type : 'text/plain' })

		blob.name = path

		return blob

	}

	blob.createFromDataTransfer = function createFromDataTransfer (dataTransfer) {

		if (!dataTransfer) {
			return null
		}

		// accessing the files.length property directly is as expensive as plucking
		// file names. thus, its making use of pluck op to get both information
		var names = _.pluck(dataTransfer.files, 'name'),
			length = names.length,
			file

		if ( length > 1 ) {
			file = this.createBlob(names.join('\n'))
		} else if ( length === 0 ) {
			var type = _(dataTransfer.types).find(function(type){
				return ~type.indexOf('text/plain') || ~type.indexOf('text/html')
			})
			file = this.createBlob(dataTransfer.getData(type))
		} else {
			file = dataTransfer.files[0]
		}

		return file

	}

	blob.readBlob = function (file, charset) {
		var dfd = q.defer()
		var reader = new FileReader(), $r = $(reader)
		$r.on('load', function (event) {
			dfd.resolve(event.target.result)
			$r.off()
		})
		$r.on('error', function (err) {
			dfd.reject(err)
			$r.off()
		})
		reader.readAsText(file, charset ? charset : null) // firefox bug : if charset is undefined, the file isn't read
		return dfd.promise
	}

	blob.downloadURL = function (file, name) {
		var mime = file.type
		return blob.readBlob(file).then(function (event) {
			var data = event.target.result
			return mime+':'+name+'.txt:data:'+mime+'base64,'+window.btoa(data)
		})
	}

	return blob

})
