
$.work = (function(){

	var cache = {};
	return function(file, options, cb) {

		// var dfd = new $.Deferred();
			
		if (window.Worker) {

			// cache[file] || (cache[file] = new Worker(file));

			var worker = new Worker(file);//cache[file];
		
			worker.addEventListener('message', function(event) {
				cb(event.data);
				// dfd.resolve(event.data); 
			}, false);

			// worker.addEventListener('error', dfd.reject, false);
			worker.postMessage(options);

		}

		// return dfd.promise();

	};

})();
