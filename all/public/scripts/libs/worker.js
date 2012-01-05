/*global define*/
define([
	'libs/jqmq',
	'jquery',
	'underscore',
	'libs/klass'
], function (jqmq, $, _, Class) {

	return Class({
		initialize : function (file) {
			_.bindAll(this);
			this.queue = jqmq({
				delay    : -1,
				batch    : 1,
				callback : this.jqmqCallback
			});
			this.worker = new Worker(file);
		},
		onresponse : function onresponse (worker, resolve, next) {
			return function onresp (event) {
				worker.onmessage = worker.onerror = null;
				resolve(event);
				next();
			};
		},
		jqmqCallback : function jqmqCallback (item) {
			item.worker.onmessage = this.onresponse(item.worker, item.success, this.queue.next);
			item.worker.onerror = this.onresponse(item.worker, item.error, this.queue.next);
			var message = _.isFunction(item.optback) ? item.optback() : item.optback;
			item.worker.postMessage( message );
		},
		perform : function workerPerform (optback) {

			var defer = $.Deferred();

			this.queue.add({
				worker  : this.worker,
				optback : optback,
				success : defer.resolve,
				error   : defer.reject
			});

			return defer;
		}
	}).statics({
		factory : function(file) {
			var worker = new this(file);
			return worker.perform;
		}
	});

});