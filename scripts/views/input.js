!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),

		template : 'tmpl-row',
		
		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.bind("change:activate", this.updateText);
			this.collection.bind("change:data", this.updateText);
			this.collection.bind("add", this.updateText);

			var self = this;
			$('.button').click(function(evt){
				if(self.collection.currentDoc){
					self.collection.currentDoc.sort();
				}
			})

		},

		updateText : function(model){

			var self = this
			, data = model.get('data');

			self.empty();

			this.trigger('updated', 'view/' + model.cid);

			if( !_.isEmpty(data) ){

				app.template(data, this.template, self.el[0]);

			} else {
				//TODO : optimize
				this.el.html(model.get('lines').join('\n'));
			}

		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();
