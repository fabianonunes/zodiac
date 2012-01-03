define(function () {

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
		}
	};


});