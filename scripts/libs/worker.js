
define(function(){
	return function(file, options, cb){
	
		if (window.Worker) {
			var worker = new Worker(file);
			worker.onmessage = function(event){
				cb(event);
				worker.terminate();
			};
			worker.postMessage(options);
		}
		
	};
});