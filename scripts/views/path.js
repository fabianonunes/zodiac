!function(){

	var ops = {
		union : '∪'
		, intersection : '∩'
		, difference : '∖'
		, symmetric : '⊖'
	};

	app.PathView = Backbone.View.extend({

		el: $('.path'),
		template : 'path', 

		initialize: function(){
			_.bindAll(this, 'render');
			this.collection.bind('change', this.render);
		},

		render : function(){
			this.empty();
			app.template({ documents : this.collection.toJSON(), ops : ops }, this.template, this.el[0]);
		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();
