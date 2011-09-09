
$.work = function(args) {

	return $.Deferred(function(dfd) {
		
		var worker;
		
		if (window.Worker) {
		
			var worker = new Worker(args.file); 
			
			worker.onmessage = function(event) {
				dfd.resolve(event); 
			};

			worker.onerror = dfd.reject;

			worker.postMessage(args.args);

		}

	}).promise();

};