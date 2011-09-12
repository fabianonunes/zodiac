!function(){

	var Text = Backbone.Model.extend({

		initialize : function(){

console.log(this);

			this.bind('change:lines', function(model){
console.log(model);
				model.set({
					length : model.get('lines').length
				});
			}, this);

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

			var self = this;

			if(_.isNull(this.currentDoc)){

				this.add({
					lines : lines
					, fileName : fileName
				});

			} else {

				$.work('/scripts/workers/text.js', {
					op : op,
					args : [this.currentDoc.get('lines'), lines]
				}).done(function(message){
					message.op = op;
					message.fileName = fileName;
					self.add(new Text(message));
				})

			}
		
		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;

}();
