
define(['libs/jqmq', 'jquery', 'underscore'], function (jqmq, $, _) {

	var workers = {};

	var queue = jqmq({
		delay    : -1,
		batch    : 1,
		callback : function callback (item) {

			item.worker.onmessage = function onmessage (queue, event) {
				this.worker.onmessage = null;
				this.worker.onerror = null;
				this.success(event);
				queue.next();
			}.bind(item, queue);

			item.worker.onerror = function onerror (queue, event) {
				this.worker.onmessage = null;
				this.worker.onerror = null;
				this.error(event);
				queue.next();
			}.bind(item, queue);

			item.worker.postMessage( item.optback() );

		}
	});

	return function (file, optback) {

		var defer = $.Deferred();

		var worker = workers[file] || (workers[file] = new Worker(file));
		// var worker = new Worker(file);

		queue.add({
			worker  : worker,
			optback : optback,
			success : defer.resolve,
			error   : defer.reject
		});

		return defer;

	};

});