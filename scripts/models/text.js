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
		union : function(){
			
		},
		intersection : function(){
			
		},
		symmetric : function(){
			
		}		
	});

	var TextPeer = Backbone.Collection.extend({
		model: Text
	});

	app.Text = Text;
	app.TextPeer = TextPeer;
	
}();
