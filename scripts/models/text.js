!function(){

	var Text = Backbone.Model.extend({

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
				args : [this.get('data')]
			}).done(function(message){
				self.set({
					data : message.data || []
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

		blend : function(lines, op){

			var self = this;

			if(_.isNull(this.currentDoc)){

				this.add({ lines : lines });

			} else {


				$.work('/scripts/workers/text.js', {
					op : op,
					args : [this.currentDoc.get('lines'), lines]
				}).done(function(message){
console.log('t->', message.t);
					self.add(new Text(message));
				})

			}
		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;
	
}();
