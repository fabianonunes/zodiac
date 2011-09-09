!function(){

	var Text = Backbone.Model.extend({

		defaults : {
			activate : 0
		},

		activate : function(){
			this.set({'activate': this.get('activate') + 1});
		}		
				
	});

	var TextPeer = Backbone.Collection.extend({
		
		model: Text,
		currentDoc : null,
		
		initialize : function(){
			
			var self = this;
			
			_.bindAll(this, 'updateIndex', 'blend');
			this.bind('change:activate', this.updateIndex);
			this.bind('add', this.updateIndex);

			this.worker = new Worker('/scripts/workers/text.js');
			this.worker.addEventListener('message', function(message){
				self.add(new Text(message.data));
			}, false);

		},
		
		updateIndex : function(m){
			this.currentDoc = m;
			this.trigger('change:currentIndex', this.currentDoc.cid)
		},

		blend : function(lines, op){

			if(_.isNull(this.currentDoc)){

				this.add({
					lines : lines
				});

			} else {

				this.worker.postMessage({
					lines1 : this.currentDoc.get('lines'),
					lines2 : lines,
					op : op
				});

			}
		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;
	
}();
