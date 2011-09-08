!function(){

	var Text = Backbone.Model.extend({

		defaults : {
			activate : 0
		},

		activate : function(){
			this.set({'activate': this.get('activate') + 1});
		},

		difference : function(){
			
		},

		union : function(lines){
			var value = _.union(this.lines, lines);
			value = _.compact(value).join('\n');
			return new Text({value:value});
		},

		intersection : function(lines){
			var value = _.intersection(this.lines, lines);
			value = _.compact(value).join('\n');
			return new Text({value:value});			
		},

		symmetric : function(){
			
		},

		initialize : function(attrs){
			this.lines = attrs.value.split('\n');
		}
				
	});

	var TextPeer = Backbone.Collection.extend({
		
		model: Text,
		currentDoc : null,
		
		initialize : function(){
			_.bindAll(this, 'updateIndex', 'blend');
			this.bind('change:activate', this.updateIndex);
			this.bind('add', this.updateIndex);
		},
		
		updateIndex : function(m){
			this.currentDoc = m;
			this.trigger('change:currentIndex', this.currentDoc.cid)
		},

		blend : function(text, op){
			if(_.isNull(this.currentDoc)){
				this.add({ value : text });
			} else {
				this.add(
					this.currentDoc[op](text.split('\n'))
				);
			}
		}

	});

	app.Text = Text;
	app.TextPeer = TextPeer;
	
}();
