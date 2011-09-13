!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),

		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.document.bind("reset", this.updateText);

			var self = this;
			$('.button').click(function(evt){
				if(self.collection.document){
					self.collection.document.get('doc').sort();
				}
			})

		},

		updateText : function(collection, name){
console.log('reset->', arguments);

			var model = collection.first();

			var self = this
			, html = model.get('html');

			self.empty();

			this.trigger('updated', 'view/' + model.cid);

			if( !_.isEmpty(html) ){

				var s = document.createElement('span');
				s.innerHTML = html;
				this.el[0].appendChild(s);

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
