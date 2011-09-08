!function(){

	var Text = Backbone.Model.extend({

		defaults : {
			activate : 0
		},

		activate : function(){
			this.set({'activate': this.get('activate') + 1});
		},

		difference : function(lines){
			var value = _.difference(this.lines, lines);
			value = _.compact(value).join('\n');
			return new Text({value:value});			
		},

		union : function(lines){

			var value = _.union(this.lines, lines);
			value = _.compact(value);

			var html = this.blame(value, this.lines, lines);
			return new Text({value:value.join('\n'), html: html});

		},

		intersection : function(lines){

			var value = _.intersection(this.lines, lines);
			value = _.compact(value);

			var html = this.blame(value, this.lines, lines);
			return new Text({value:value.join('\n'), html: html});			
		},

		symmetric : function(lines){
			var intersection = _.intersection(this.lines, lines);
			var union = _.union(this.lines, lines);
			var value = _.difference(union, intersection);
			value = _.compact(value).join('\n');
			return new Text({value:value});			
		},

		initialize : function(attrs){
			this.lines = _.compact(attrs.value.split('\n'));
		},

		blame : function(result, op, opr){
			var r = _.map(result, function(line){
				var r = "<span class='";
				r += _.include(op, line) ? 'red' : ''; 
				r += _.include(opr, line) ? 'blue' : ''; 
				r += "'>" + line + '</span>';
				return r;
			});
			return r.join('\n');
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
