!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),

		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.currentDoc.bind("change", this.updateText);

			var self = this;
			$('.button').click(function(evt){
				if(self.collection.currentDoc){
					self.collection.currentDoc.get('doc').sort();
				}
			})

		},

		updateText : function(model, name){

			var self = this
			, html = model.get('doc').get('html');

			self.empty();

			this.trigger('updated', 'view/' + model.get('doc').cid);

			if( !_.isEmpty(html) ){

				var s = document.createElement('span');
				s.innerHTML = html;
				this.el[0].appendChild(s);

			} else {
				//TODO : optimize
				this.el.html(model.get('doc').get('lines').join('\n'));
			}

		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();
