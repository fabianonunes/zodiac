
$.work = (function(){

	var cache = {};
	return function(file, options) {

		var dfd = new $.Deferred();
			
		if (window.Worker) {

			cache[file] || (cache[file] = new Worker(file));

			var worker = cache[file];
		
			worker.addEventListener('message', function(event) {
				dfd.resolve(event.data); 
			}, false);

			worker.addEventListener('error', dfd.reject, false);
			worker.postMessage(options);

		}

		return dfd.promise();

	};

})();
