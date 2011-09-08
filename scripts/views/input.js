!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),
		
		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.bind("change:activate", this.updateText);
			this.collection.bind("add", this.updateText);

		},

		updateText : function(model){

			this.trigger('updated', 'view/'+model.cid);

			if(!_.isEmpty(model.get('html'))){
				this.el.html(model.get('html'));
			} else {
				this.el.html(model.get('value'));
			}

		}

	});

}();
