!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),

		// docFragment : document.createDocumentFragment(),

		template : 'tmpl-row',
		
		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.bind("change:activate", this.updateText);
			this.collection.bind("add", this.updateText);

			// app.template

		},

		updateText : function(model){

			var self = this
			, data = model.get('data');

			this.trigger('updated', 'view/'+model.cid);

// console.profile();

			if( !_.isEmpty(data) ){

				// var fragment = document.createDocumentFragment();

				var s = document.createElement('span');
				var text = '';
				app.template({ data : data }, this.template, function(out){
					if(!out) return;
					text += out;
				}, function(){

					s.innerHTML = text;

					// fragment.appendChild(s);

					if(self.el[0].firstChild){
						self.el[0].removeChild(self.el[0].firstChild);
					}				

					self.el[0].appendChild(s);

				});

			} else {
				this.el.html(model.get('lines').join('\n'));
			}

// console.profileEnd();


		}

	});

}();
