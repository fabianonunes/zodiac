/*global define*/
/*!
 * jQuery Message Queuing - v1.0 - 1/5/2010
 * http://benalman.com/projects/jquery-message-queuing-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

 define(['jquery'], function($){
	// Queue defaults.
	var defaults = {
		delay: 100,
		batch: 1,
		/*
		callback: null,
		complete: null,
		paused: false,
		*/
		queue: []
	};

	var jqmq = function( opts ) {

		// The queue object to be returned.
		var self = {},

			// Initialize queue with passed options.
			options = $.extend( true, {}, defaults, opts ),

			// The actual queue.
			queue = options.queue,

			paused = options.paused,
			recent = [],
			timeout_id,
			cleared,

			// Method references.
			addEach,
			size,
			start;

		// Stop a running queue, optionally flagging it as paused.
		function stop() {
			if (timeout_id) {
				clearTimeout( timeout_id );
			}
			timeout_id = undefined;
		}


		self.add = function( item, priority ) {
			return addEach( [ item ], priority );
		};

		self.addEach = addEach = function( items, priority ) {
			if ( items ) {
				// Unset "cleared" status.
				cleared = false;

				// Push all items, individually, onto the queue. If priority is true, send
				// them to the beginning, otherwise, send them to the end.
				queue = priority ? items.concat( queue ) : queue.concat( items );

				// If queue isn't explicitly paused, restart it.
				if (!paused) {
					start();
				}
			}

			return size();
		};

		self.start = start = function() {
			// Flag queue as un-paused.
			paused = false;

			if ( size() && !timeout_id && !recent.length ) {

				(function loopy(){
					var delay = options.delay,
						batch = options.batch,
						complete = options.complete,
						callback = options.callback;

					// Clear timeout_id.
					stop();

					// If queue is empty, call the "complete" method if it exists and quit.
					if ( !size() ) {
						cleared = true;
						if (complete) {
							complete.call( self );
						}
						return;
					}

					// Queue has items, so shift off the first `batch` items.
					recent = queue.splice( 0, batch );

					// If "callback" method returns true, unshift the queue items for
					// another attempt.
					if ( callback && callback.call( self, batch === 1 ? recent[0] : recent ) === true ) {
						queue = recent.concat( queue );
						recent = [];
					}

					// Repeatedly loop if the delay is a number >= 0, otherwise wait for a
					// _.jqmqNext() call.
					if ( typeof delay === 'number' && delay >= 0 ) {
						recent = [];
						timeout_id = setTimeout( loopy, delay );
					}
				}());
			}
		};

		self.next = function( retry ) {
			var complete = options.complete;

			if ( retry ) {
				queue = recent.concat( queue );
			}

			recent = [];

			if ( size() ) {
				if (!paused) {
					start();
				}
			} else if ( !cleared ) {
				cleared = true;
				if (complete) {
					complete.call( self );
				}
			}
		};

		self.clear = function() {
			var result = queue;

			// Stop the queue if it is running.
			stop();

			// Clear the queue.
			queue = [];
			cleared = true;

			// Reset the recent items list.
			recent = [];

			// Return the previous queue, in case it's needed for some reason.
			return result;
		};

		self.pause = function() {
			// Stop the queue if it is running.
			stop();

			// Flag it as paused.
			paused = true;
		};

		self.update = function( opts ) {
			$.extend( options, opts );
		};

		self.size = size = function() {
			return queue.length;
		};

		self.indexOf = function( item ) {
			return $.inArray( item, queue );
		};

		// If queue isn't explicitly paused, start it.
		if (!paused) {
			start();
		}

		return self;
	};

	return jqmq;

});
