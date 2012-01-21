/*global define*/
// source : http://shadow2531.com/opera/testcases/datauri/
define(function () {
	function trim(s) {
		return s.replace(/^\s\s*/, '').replace(/\s\s*$/, '')
	}
	function percentDecode(s) {
		return decodeURIComponent(s)
	}
	function parseDataURI(URI) {
		if(!URI) return null
		if (URI.match(/^data:/i) === null) {
			throw new Error("MALFORMED_URI")
		}
		var comma = URI.indexOf(",")
		if (comma === -1) {
			throw new Error("MALFORMED_URI")
		}
		var supportedContentEncodings = ["base64"]
		var mimeType = "text/plain"
		var contentEncoding = ""
		var contentEncodingAlreadySet = false
		var supportedValues = {
			"charset" : "",
			"filename" : "",
			"content-disposition" : ""
		}
		var supportedValueSetBits = {}
		for (var i in supportedValues) {
			if (supportedValues.hasOwnProperty(i)) {
				supportedValueSetBits[i] = false
			}
		}
		var temp = URI.substring(5, comma)
		var headers = temp.split(";")
		for (i = 0; i < headers.length; ++i) {
			var s = headers[i].toLowerCase()
			var eq = s.indexOf("=")
			var name = ""
			var value = ""
			if (eq === -1) {
				name = trim(percentDecode(s))
			} else {
				name = trim(percentDecode(s.substring(0, eq)))
				value = trim(percentDecode(s.substr(eq + 1)))
			}
			if (i === 0 && eq === -1 && name.length > 0) {
				mimeType = name
			} else {
				if (eq === -1) {
					if (supportedContentEncodings.indexOf(name) !== -1) {
						if (!contentEncodingAlreadySet) {
							contentEncoding = name
							contentEncodingAlreadySet = true
						}
					}
				} else {
					if (value.length > 0 && supportedValues.hasOwnProperty(name)) {
						if (supportedValueSetBits[name] === false) {
							supportedValues[name] = value
							supportedValueSetBits[name] = true
						}
					}
				}
			}
		}
		var data = percentDecode(URI.substr(comma + 1))
		var dataURIObject = {}
		dataURIObject.mimeType = mimeType
		dataURIObject.contentEncoding = contentEncoding
		dataURIObject.headers = supportedValues
		dataURIObject.data = data
		return dataURIObject
	}
	return parseDataURI
})