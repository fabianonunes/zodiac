
$.work = function(file, options, cb) {

	if (window.Worker) {

		// cache[file] || (cache[file] = new Worker(file));

		var worker = new Worker(file);//cache[file];
		worker.onmessage = function(event){
			cb(event);
			worker.terminate();
		}
		worker.postMessage(options);

	}

};