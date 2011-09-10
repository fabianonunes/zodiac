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
// debugger;				
				if(self.collection.currentDoc){
					self.collection.currentDoc.sort();
				}
			})

		},

		updateText : function(model){

			var self = this
			, data = model.get('data');

			this.trigger('updated', 'view/'+model.cid);

			if( !_.isEmpty(data) ){


				var s = document.createElement('span');
				app.template({ data : data }, this.template, function(out){
					self.empty();
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
