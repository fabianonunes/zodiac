
define(function(){
	var worker;
	return function(file, options, cb){
	
		if (window.Worker) {
			
			worker = worker || new Worker(file);

			worker.onmessage = function(event){
				cb(event);
				// worker.terminate();
			};

			worker.postMessage(options);
			
		}
		
	};
});