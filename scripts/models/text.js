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
		
		initialize : function(){
			
			window.models[this.cid] = this;

			var previous = this.get('previous');

			this.findPath(previous);

			if(previous){
		
				this.perform(true);
				this.bind('change:op', this.perform, this);
				previous.bind('change:lines', this.perform, this);
			
			} else {
				// needs to defer to force triggering change event
				_.defer(this.activate.bind(this, { length : this.get('lines').length }));
			}

		},
		
		perform : function(added){

			var self = this;

			$.work('/scripts/workers/text.js', {
				op : this.get('op'),
				args : [this.get('previous').get('lines'), this.get('origin')]
			}).done(function(message){

				self.findPath(self.get('previous'));
				(added === true) ? self.activate(message) : self.set(message);
				self.trigger('change:performed', self);

			});

		},
		
		sort : function(){

			$.work('/scripts/workers/text.js', {
				op : 'sort',
				args : [this.get('lines'), this.get('data')]
			}).done(this.activate.bind(this));

		},
		
		activate : function(args){
			var params = args || {};
			params.activate = this.get('activate') + 1;
			this.set(params);
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
			this.bind('change:performed', this.performed);

		},

		performed : function(m){
			m.cid === this.currentIndex && m.trigger("change:activate", m);
		},
	
		updateDocument : function(m){
			this.currentIndex = m.cid;
			this.trigger('change:currentIndex', m.cid, m)
		},

		blend : function(lines, fileName, op){
			this.add({
				previous : this.currentDocument()
				, op : op
				, fileName : fileName
				, lines : lines
				, origin : lines
			});
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


			//