!function(){

	app.PathView = Backbone.View.extend({

		el: $('.path'),

		template : 'path', 

		initialize: function(){

		},


		// app.template(model.toJSON(), this.template, this.el[0]);

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();
