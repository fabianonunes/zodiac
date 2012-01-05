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
			jquery     : 'libs/jquery/jquery-1.7.1',
			underscore : 'libs/underscore-1.2.2.min',
			backbone   : 'libs/backbone-0.5.3',
			dust       : 'libs/dust-0.3.0.min'
		}
	};
}));
