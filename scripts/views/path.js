!function(){

	app.PathView = Backbone.View.extend({

		tagName : 'div',

		events : {
			'click .remove' : 'destroy'
		},

		template : 'path', 

		initialize : function(){
			
			_.bindAll(this, 'render', 'destroy');

			this.model.bind('change:length', this.render);

			this.model.view = this;

		},

		destroy : function(){
			this.unbind();
			this.model.destroy();
			this.remove();
		},

		render : function(){

			var dfd = $.Deferred();

			var doc = {
				op : this.model.get('op')
				, fileName : this.model.get('fileName')
				, length : this.model.get('length')
				, id : this.model.id
			};

			$(this.el).empty();
			
			app.template({
				documents : [doc]
				, ops : oprs
			}, this.template, this.el, dfd.resolve.bind(dfd, this.el));

			return dfd.promise();
				
		}

	});

	app.PathListView = Backbone.View.extend({

		el: $('.path'),
		template : 'path', 

		events : {
			'change select' : 'change'
		},

		initialize: function(){
			_.bindAll(this, 'render', 'change');
			this.collection.bind('change:added', this.render);
		},

		change : function(e){
			var select = $(e.target);
			var id = select.attr('class');
			this.collection.get(id).set({ op : select.val() });
		},

		render : function(model){

			var self = this;

			var view = new app.PathView({ model : model });

			view.render().then(this.el.append.bind(this.el));

		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}
		}

	});

}();

function oprs(chunk, context, bodies){

	var ops = {
		union : '∪' ,
		intersection : '∩' ,
		difference : '∖' ,
		symmetric : '⊖'
	};

	var document = context.current(), retval = [];

	Object.keys(ops).forEach(function(k){
		retval.push({
			type : k
			, symbol : ops[k]
			, selected : document.op === k
		});
	});

	return retval;

}
