!function(){

	var ops = {
		union : '∪'
		, intersection : '∩'
		, difference : '∖'
		, symmetric : '⊖'
	};

	var Text = Backbone.Model.extend({

		initialize : function(){

			var previous = this.get('previous');

			this.set({
				path : [
					previous && previous.get('path')
					, previous && ops[this.get('op')]
					, this.get('fileName')
				].join('')
			});

			if(previous){

				this.perform(this.get('op'));

				previous.bind('change:op', this.perform, this);

			} else {
				this.set({ length : this.get('lines').length });
				// needs to defer to force triggering change event
				_.defer(this.activate.bind(this))

			}


		},

		perform : function(op){

			$.work('/scripts/workers/text.js', {
				op : op,
				args : [this.get('previous').get('lines'), this.get('lines')]
			}).done(this.set.bind(this));
			
		},

		defaults : {
			activate : 0
		},

		activate : function(){
			this.set({'activate': this.get('activate') + 1});
		},

		sort : function(){

			var self = this;

			$.work('/scripts/workers/text.js', {
				op : 'sort',
				args : [this.get('lines'), this.get('data')]
			}).done(function(message){
				self.set({
					html : message
				});
			});

		}
			
	});

	var TextPeer = Backbone.Collection.extend({
	
		model: Text,
		currentDoc : null,
	
		initialize : function(){
		
			var self = this;
		
			_.bindAll(this, 'updateDocument', 'blend');
			this.bind('change:activate', this.updateDocument);
			this.bind('add', this.updateDocument);

		},
	
		updateDocument : function(m){
			this.currentDoc = m;
			this.trigger('change:currentIndex', m.cid)
		},

		blend : function(lines, fileName, op){

			this.add({
				previous : this.currentDoc
				, op : op
				, fileName : fileName
				, lines : lines
			});

		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;

}();
