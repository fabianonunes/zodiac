!function(){

	var ops = {
		union : '∪'
		, intersection : '∩'
		, difference : '∖'
		, symmetric : '⊖'
	};

	var Text = Backbone.Model.extend({

		defaults : { activate : 0 },
		
		initialize : function(attrs, options){

			this.collection = options.collection;
			this.set({ cid : this.cid });

			if(this.get('previous')){

				this.bind('change:op', this.perform, this);
				this.getPrevious().bind('change:length', this.perform, this);
			
			} else {

				this.set({ op : 'charge' });

			}

			this.perform(true);

		},
		
		perform : function(added){

			$.work('/scripts/workers/text-worker.js', {
				op : this.get('op')
				, previous : this.getPrevious() && this.getPrevious().lines
				, file : this.get('origin')
			}, this.afterWork.bind(this, added));

		},

		afterWork : function(added, message){

			this.lines = message.data.lines;

			this.set({ length : message.data.length });

			if(this.cid === this.collection.currentIndex || added === true){
				this.collection.updateDocument(this, message.data.html);
			} 

		},
		
		sort : function(){

			$.work('/scripts/workers/text-worker.js', {
				op : 'sort'
				, lines : this.lines
				, classes : this.classes
			}, this.afterWork.bind(this, false));

		},
		
		getPrevious : function(){
			return this.collection.getByCid(this.get('previous'));
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

		blend : function(file, op){
			var m = new Text({
				previous : this.currentIndex
				, op : op
				, origin : file
				, fileName : file.name
			}, { collection : this });
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
