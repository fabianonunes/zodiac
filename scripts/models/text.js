!function(){

	window.models = {};

	var ops = {
		union : '∪'
		, intersection : '∩'
		, difference : '∖'
		, symmetric : '⊖'
	};

	var Text = Backbone.Model.extend({

		defaults : { activate : 0 },
		
		initialize : function(attrs, options){

			this.lines = options.lines;
			this.collection = options.collection;
			this.set({ cid : this.cid });

			// this.findPath(this.getPrevious());

			if(this.get('previous')){
		
				this.perform(true);
				this.bind('change:op', this.perform, this);
				this.getPrevious().bind('change:length', this.perform, this);
			
			} else {
				// needs to defer to force triggering change event
				this.set({op : null});
				_.defer(this.activate.bind(this));
			}

		},
		
		perform : function(added){

			$.work('/scripts/workers/text-worker.js', {
				op : this.get('op')
				, previous : this.getPrevious().lines
				, file : this.get('origin')
			}, this.afterWork.bind(this, added));

		},

		afterWork : function(added, message){			

			this.findPath(this.getPrevious());

			this.lines = message.data.lines;

			var data = { length : message.data.length };

			(added === true) ? this.activate(data) : this.set(data);
			
			if(this.cid === this.collection.currentIndex){
				this.collection.updateDocument(this, message.data.html);
			} 

		},
		
		sort : function(){

			$.work('/scripts/workers/text-worker.js', {
				op : 'sort',
				args : [this.get('lines'), this.get('data')]
			}, this.activate.bind(this));

		},
		
		activate : function(args){
			var params = args || {};
			params.activate = this.get('activate') + 1;
			this.set(params);
		},

		getPrevious : function(){
			return this.collection.getByCid(this.get('previous'));
		},
		
		findPath : function(previous){
			 this.set({
				path : [
					previous && previous.get('path')
					, previous && ops[this.get('op')]
					, this.get('fileName')
				].join('')
			});			
		}
			
	});

	var TextPeer = Backbone.Collection.extend({
	
		model: Text,
		currentIndex : null,
	
		initialize : function(){

			var self = this;
			_.bindAll(this, 'updateDocument', 'blend');
			this.bind('change:activate', this.updateDocument);

		},

		updateDocument : function(m, html){
			this.currentIndex = m.cid;
			this.trigger('change:currentIndex', m.cid, m, html)
		},

		blend : function(file, lines, op){
			var m = new Text({
				previous : this.currentIndex
				, op : op
				, fileName : file.name
				, length : lines.length
				, origin : file
			}, { lines : lines, collection : this });
			this.add(m);
		},

		sortDocument : function(){
			this.currentIndex && this.currentDocument().sort();
		},

		currentDocument : function(){
			return this.getByCid(this.currentIndex);
		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;

}();
