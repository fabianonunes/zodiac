!function(){

	app.PathView = Backbone.View.extend({

		el: $('.path'),

		template : 'path', 

		initialize: function(){

			_.bindAll(this, 'render');

			this.collection.bind('change', this.render);

		},

		render : function(){
console.log('rendering->');
			this.empty();
			app.template({ documents : this.collection.toJSON() }, this.template, this.el[0]);
		},



		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();
