
define(['libs/jqmq'], function (jqmq) {

	var workers = {};

	var queue = jqmq({
		delay    : -1,
		batch    : 1,
		callback : function (item) {
			item.worker.onmessage = function (event) {
				item.worker.onmessage = null;
				item.callback(event);
				queue.next(false);
			};
			item.worker.postMessage(item.optback());
		}
	});

	return function (file, optback, cb) {

		var worker = workers[file] || (workers[file] = new Worker(file));

		queue.add({
			worker   : worker,
			optback  : optback,
			callback : cb
		});

	};

});