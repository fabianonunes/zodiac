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

// console.profile();

			if( !_.isEmpty(data) ){

				// app.template(this.el, { data : data }, this.template);
				 this.el.jqoteapp(
				 	'<span class="<%= this.class %>"><%= this.line %></span>'
					, data
    			);

			} else {
				this.el.html(model.get('value'));
			}

// console.profileEnd();


		}

	});

}();
