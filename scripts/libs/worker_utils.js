
$.work = (function(){

	var cache = {};
	var i = 0;

	return (function(file, options) {

		return $.Deferred(function(dfd) {
			
			var worker;
			
			if (window.Worker) {

				if(!cache[file]){
					cache[file] = new Worker(file);
				}
			
				var worker = cache[file];
				
				worker.addEventListener('message', function(event) {
					dfd.resolve(event.data); 
				}, false);

				worker.addEventListener('error', dfd.reject, false);

				worker.postMessage(options);

			}

		}).promise();

	});

})();
