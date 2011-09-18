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

			if(this.get('previous')){

				this.bind('change:op', this.perform, this);
				this.getPrevious().bind('change:length', this.perform, this);
			
			} else {

				this.set({ op : 'charge' });

			}

			this.perform(true);

		},

		destroy : function(){
			this.unbindAll();
			this.collection.remove(this);
		},

		unbindAll : function(){
			
			this.unbind();

			var next, previous;

			(previous = this.getPrevious()) && previous.unbind('change:length');
			(next = this.getNext()) && next.setPrevious(previous);

			// (next = this.getNext()) && next.unbind('change:length');


		},

		setPrevious : function(previous){
			// this.unbind('change:length');
			this.set({ id : previous.id });
			previous.bind('change:length', this.perform, this);
		},
				
		perform : function(added){

			$.work('/scripts/workers/text-worker.js', {
				op : this.get('op')
				, previous : this.getPrevious() && this.getPrevious().lines
				, file : this.get('origin')
			}, this.afterWork.bind(this, added));

		},

		sort : function(){

			$.work('/scripts/workers/text-worker.js', {
				op : 'sort'
				, lines : this.lines
				, classes : this.classes
			}, this.afterWork.bind(this, false));

		},

		activate : function(){
			this.collection.updateDocument(this);
		},

		afterWork : function(added, message){

			!_.isUndefined(message.data.lines) && (this.lines = message.data.lines);

			this.html = message.data.html;

			this.set({ length : message.data.length });

			if(this.id === this.collection.currentIndex || added === true){
				this.collection.updateDocument(this, this.html);
			} 

			if(added === true){
				this.trigger('change:added', this);
			}

		},
		
		getPrevious : function(){
			return this.collection.get(this.get('previous'));
		},

		getNext : function(){
			return this.collection.detect(function(model){
				return model.get('previous') === this.id;
			}.bind(this));
		}

			
	});

	var TextPeer = Backbone.Collection.extend({
	
		model: Text,
		currentIndex : null,
	
		initialize : function(){

			var self = this;
			_.bindAll(this, 'updateDocument', 'blend');
			this.bind('change:activate', this.updateDocument);
			this.bind('destroy', function(m){
				self.remove(m);
			});

		},

		updateDocument : function(m){
			this.currentIndex = m.id;
			this.trigger('change:currentIndex', m.id, m, m.html)
		},

		blend : function(file, op){
			var m = new Text({
				previous : this.currentIndex
				, op : op
				, origin : file
				, fileName : file.name
				, id : _.uniqueId('text')
			}, { collection : this });
			this.add(m);
		},

		sortDocument : function(){
			this.currentIndex && this.currentDocument().sort();
		},

		currentDocument : function(){
			return this.get(this.currentIndex);
		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;

}();
