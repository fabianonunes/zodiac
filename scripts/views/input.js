!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),

		docFragment : document.createDocumentFragment(),

		template : 'tmpl-row',
		
		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.bind("change:activate", this.updateText);
			this.collection.bind("add", this.updateText);

		},

		updateText : function(model){

			var self = this
			, data = model.get('data');

			this.trigger('updated', 'view/'+model.cid);

			if( !_.isEmpty(data) ){

				self.empty();

				var s = document.createElement('span');
				app.template({ data : data }, this.template, function(out){
					s.innerHTML = out;
					self.el[0].appendChild(s);
				});

			} else {
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
