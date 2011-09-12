!function(){

	app.DetailsView = Backbone.View.extend({

		el: $('.details'),

		template : 'details', 

		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.bind("change", this.updateText);
			this.collection.bind("add", this.updateText);

		},

		updateText : function(model, name){

			this.empty();

console.log(arguments);

			app.template(model.toJSON(), this.template, this.el[0]);

		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();
