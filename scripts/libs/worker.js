
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
			worker.postMessage(item.options);
		}
	});

	return function (file, options, cb) {

		if (window.Worker) {

			worker = worker || new Worker(file);

			queue.add({
				options : options,
				callback : cb
			});

		}

	};

});