
define(['libs/jqmq'], function (jqmq) {

	var worker;

	var queue = jqmq({
		delay : -1,
		batch : 1,
		callback : function (item) {
			worker.onmessage = function (event) {
				item.callback(event);
				queue.next(false);
			};
			worker.postMessage(item.optback());
		}
	});

	return function (file, optback, cb) {

		if (window.Worker) {

			worker = worker || new Worker(file);

			queue.add({
				optback : optback,
				callback : cb
			});

		}

	};

});