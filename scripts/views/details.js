!function(){

	app.DetailsView = Backbone.View.extend({

		el: $('.details'),

		template : 'details', 

		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.bind("change:currentIndex", this.updateText);

		},

		updateText : function(cid, model){

			this.empty();

			var doc = model.toJSON();

			app.template({
				length : doc.length
				, path : doc.path
			}, this.template, this.el[0]);

		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();
