/*global define*/
(function (def){
	if (typeof define === 'function'){ // AMD
		define(function () { return def(); });
	} else if (typeof module !== 'undefined' && module.exports) { // Node.js
		module.exports = def();
	}
}(function () {
	return {
		paths : {
			jquery     : 'lib/vendor/jquery-1.7.1.min',
			backbone   : 'lib/vendor/backbone-0.9.1',
			underscore : 'lib/vendor/underscore',
			publisher  : 'lib/vendor/publisher-1.3.0',
			dust       : 'lib/vendor/dust-0.3.0'
		}
	};
}));
