
define([
	'underscore',
	'templates',
	'models/text',
	'views/dropper',
	'views/input',
	'views/path'
], function(_, dust, TextPeer, dropper, input, path){

	var app = {};
	
	app.initialize = function(){

		this.documents = new TextPeer();

		new dropper({
			collection: this.documents
		});
		new input({
			collection: this.documents
		});
		var pathView = new path({
			collection: this.documents
		});

		// var m = new this.documents.model({
		// 	length: 10,
		// 	fileName : 'fabiano',
		// 	op : 'union',
		// 	id : _.uniqueId('text')
		// }, {
		// 	collection : this.documents
		// });

		// this.documents.add(m);
		
		// var n = new this.documents.model({
		// 	length: 10,
		// 	fileName : 'fabiano',
		// 	op : 'union',
		// 	id : _.uniqueId('text')
		// }, {
		// 	collection : this.documents
		// });

		// n.set({previous: m});
		// this.documents.add(n);
		// var o = new this.documents.model({
		// 	length: 10,
		// 	fileName : 'fabiano',
		// 	op : 'union',
		// 	id : _.uniqueId('text')
		// }, {
		// 	collection : this.documents
		// });

		// o.set({previous: n});
		// this.documents.add(o);

		// pathView.render(m);
		// pathView.render(n);
		// pathView.render(o);

		
	};
	
	return app;

});
