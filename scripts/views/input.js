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

	
				// app.template(this.el, { data : data }, this.template);
				this.el.jqotesub(
				 	'<span class="<%= this.classe %>"><%= this.line %></span>'
					, data
    			);

    			// this.el.append($('#template').jqote(data));

    	 // 	this.el.append(
      //   		$('#template').jqote(data, '*')
    		// );

			} else {
				this.el.html(model.get('value'));
			}

// console.profileEnd();


		}

	});

}();
