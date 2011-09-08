!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),

		docFragment : document.createDocumentFragment(),

		template : 'tmpl-row',
		
		initialize: function(){

			_.bindAll(this, 'updateText');

			this.collection.bind("change:activate", this.updateText);
			this.collection.bind("add", this.updateText);

			 $('#template').jqote({greet: 'Hello', who: 'John'}, '*')

		},

		updateText : function(model){

			var self = this
			, data = model.get('data');

			this.trigger('updated', 'view/'+model.cid);

// console.profile();

			if( !_.isEmpty(data) ){

				var fragment = document.createDocumentFragment();

				var s = document.createElement('span');

				app.template({ data : data }, this.template)
				.done(function(out){
					s.innerHTML = out;
				});

				// $(s).jqotesub(
				// 	'<span class="<%= this.classe %>"><%= this.line %></span>'
				// 	, data
				// );

				this.el.empty();
				fragment.appendChild(s);
				this.el[0].appendChild(fragment);

			} else {
				this.el.html(model.get('value'));
			}

// console.profileEnd();


		}

	});

}();
