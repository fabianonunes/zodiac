/*global define*/
define([
	'lib/jqmq',
	'jquery',
	'underscore',
	'lib/klass',
	'lib/emitter'
], function (jqmq, $, _, Class, EventEmitter) {

	var WorkerPerformer = Class(EventEmitter).extend(function WorkerPerformer (file) {
		_.bindAll(this)
		this.queue = jqmq({
			batch    : 1,
			delay    : -1,
			callback : this.jqmqCallback,
			complete : this.emit.bind(this, 'complete')
		})
		this.worker = new Worker(file)
	}).methods({
		onresponse : function onresponse (worker, resolve, next) {
			return function onresp (event) {
				worker.onmessage = worker.onerror = null
				resolve(event.data)
				next()
			}
		},
		jqmqCallback : function jqmqCallback (item) {
			item.worker.onmessage = this.onresponse(item.worker, item.success, this.queue.next)
			item.worker.onerror = this.onresponse(item.worker, item.error, this.queue.next)
			var message = _.isFunction(item.optback) ? item.optback() : item.optback
			item.worker.postMessage( message )
		},
		perform : function workerPerform (optback) {

			var defer = $.Deferred()

			this.queue.add({
				worker  : this.worker,
				optback : optback,
				success : defer.resolve,
				error   : defer.reject
			})

			return defer

		},
		bind : function () {
			this.on.apply(this, arguments);
		}
	}).statics({
		factory : function(file) {
			var worker = new WorkerPerformer(file)
			return worker
		}
	})

	return WorkerPerformer

})
