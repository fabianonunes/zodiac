
define(['libs/jqmq', 'jquery'], function (jqmq, $) {

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

		var defer = $.Deferred();

		var worker = workers[file] || (workers[file] = new Worker(file));

		queue.add({
			worker   : worker,
			optback  : optback,
			callback : defer.resolve
		});

		return defer.promise();

	};

});