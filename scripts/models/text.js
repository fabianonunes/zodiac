!function(){

	var Text = Backbone.Model.extend({

		initialize : function(attrs, options){

			this.bind('change:op', this.perform, this);
			this.bind('change:previous', this.perform, this);

			this.collection = options.collection;
			this.setPrevious(options.previous, { silent : true });

			this.perform(true);

		},

		perform : function(added){

			$.work('/scripts/workers/text-worker.js', {
				op : this.get('op')
				, previous : this.getPrevious() && this.getPrevious().lines
				, file : this.get('origin')
			}, this.afterWork.bind(this, added));

		},

		destroy : function(){
			this.unbind();
			this.collection.destroy(this);
		},

		setPrevious : function(previous, options){

			if(previous){
				this.set({ previous : previous.id }, options);
				previous.bind('change:length', this.perform, this);
			} else {
				this.set({ op : 'charge' });
			}

		},

		isActivated : function(){
			return this.collection.currentIndex === this.id;
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

			if(this.isActivated() || added === true){
				this.activate();
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
			_.bindAll(this, 'updateDocument', 'blend');
			this.bind('destroy', this.remove);
		},

		updateDocument : function(m){
			this.currentIndex = m.id;
			this.trigger('change:currentIndex', m.id, m, m.html)
		},

		destroy : function(m){
			var next = m.getNext(), previous = m.getPrevious();
			this.remove(m);
			this.length ? this.tie(next, previous) : this.reset();
		},

		tie : function(next, previous){
			previous && previous.unbind('change:length');
			next ? next.setPrevious(previous) : previous && previous.activate();			
		},

		blend : function(file, op){
			var m = new Text({
				op : op
				, origin : file
				, fileName : file.name
				, id : _.uniqueId('text')
			}, {
				collection : this
				, previous : this.currentDocument()
			});
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
