
define(['libs/jqmq', 'jquery', 'underscore'], function (jqmq, $, _) {

	var workers = {};

	var queue = jqmq({
		delay    : -1,
		batch    : 1,
		callback : function callback (item) {
			item.worker.onmessage = function onmessage (event) {
				item.worker.onmessage = null;
				item.worker.onerror = null;
				item.promise.resolve(event);
				queue.next();
			};
			item.worker.onerror = function onerror () {
				item.worker.onmessage = null;
				item.worker.onerror = null;
				item.promise.reject();
				queue.next();
			};
			item.worker.postMessage(item.optback());
		}
	});

	return function (file, optback) {

		var defer = $.Deferred();

		var worker = workers[file] || (workers[file] = new Worker(file));

		queue.add({
			worker   : worker,
			optback  : optback,
			promise  : defer
		});

		return defer.promise();

	};

});