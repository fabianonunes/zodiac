
define(['libs/jqmq', 'jquery', 'underscore'], function (jqmq, $, _) {

	var workers = {};

	var queue = jqmq({
		delay    : -1,
		batch    : 1,
		callback : function callback (item) {
			item.worker.onmessage = function (event) {
				item.success(event);
				queue.next();
			};
			item.worker.onerror = function (event) {
				item.error(event);
				queue.next();
			};
			item.worker.postMessage(item.optback());
		}
	});

	return function (file, optback) {

		var defer = $.Deferred();

		var worker = workers[file] || (workers[file] = new Worker(file));

		queue.add({
			worker  : worker,
			optback : optback,
			success : defer.resolve,
			error   : defer.reject
		});

		return defer.then(function(){
			worker.onmessage = null;
			worker.onerror = null;
		});

	};

});