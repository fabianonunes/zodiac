
define(['libs/jqmq', 'jquery', 'underscore'], function (jqmq, $, _) {

	var workers = {};

	var queue = jqmq({
		delay    : -1,
		batch    : 1,
		callback : function jqmqCallback (item) {
			item.worker.onmessage = onresponse(item.worker, item.success, queue.next);
			item.worker.onerror = onresponse(item.worker, item.error, queue.next);
			var message = _.isFunction(item.optback) ? item.optback() : item.optback;
			item.worker.postMessage( message );
		}
	});

	function onresponse (worker, resolve, next) {
		return function onresp (event) {
			worker.onmessage = null;
			worker.onerror = null;
			resolve(event);
			next();
		};
	}

	return function (file, optback) {

		return $.Deferred(function workerDfd (defer) {

			var worker = workers[file] || (workers[file] = new Worker(file));

			queue.add({
				worker  : worker,
				optback : optback,
				success : defer.resolve,
				error   : defer.reject
			});

		});

	};

});