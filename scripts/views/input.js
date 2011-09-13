!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),

		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.bind("change:currentIndex", this.updateText);

			var self = this;
			$('.button').click(function(evt){
				if(self.collection.document){
					self.collection.document.get('doc').sort();
				}
			})

		},

		updateText : function(cid, model){
console.log('reset->', arguments);

			var self = this
			, html = model.get('html');

			self.empty();

			this.trigger('updated', 'view/' + cid);

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
