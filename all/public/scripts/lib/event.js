/*global define*/
define(['underscore'], function (_) {

	return {
		cancel : function (event) {
			event = event.originalEvent || event;
			event.preventDefault();
			return false;
		},
		elementFromCursor : function (event) {
			event = event.originalEvent || event;
			var x = event.clientX;
			var y = event.clientY;
			return document.elementFromPoint(x, y);
		},
		domhash : function (arg) {
			if (arg) {
				return arg.id || ( arg.id = _.uniqueId('anonymous_element') );
			}
		}
	};


});
