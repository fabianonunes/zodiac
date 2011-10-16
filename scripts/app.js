
define([
	'templates',
	'models/text',
	'views/dropper',
	'views/input',
	'views/path'
], function(dust, TextPeer, dropper, input, path){

	var app = {};
	
	app.initialize = function(){

		this.documents = new TextPeer();

		new dropper({
			collection: this.documents
		});
		new input({
			collection: this.documents
		});
		new path({
			collection: this.documents
		});	
		
	};
	
	return app;

});
