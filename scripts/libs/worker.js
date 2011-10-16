
define(function(){
	var worker = new Worker('/scripts/workers/text-worker.js');
	return function(file, options, cb){
	
		if (window.Worker) {

			worker.onmessage = function(event){
				cb(event);
				// worker.terminate();
			};

			worker.postMessage(options);

		}
		
	};
});