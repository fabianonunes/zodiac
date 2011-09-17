!function(){

	app.PathView = Backbone.View.extend({

		tagName : 'div',

		events : {},

		template : 'path', 

		initialize : function(){
			
			_.bindAll(this, 'render');

			// this.model.bind('change', this.render);

			this.model.view = this;

		},

		render : function(cb){

			console.log(this.model.get('length'));

			var doc = {
				op : this.model.get('op')
				, fileName : this.model.get('fileName')
				, length : this.model.get('length')
				, id : this.model.id
			};
			
			app.template({
				documents : [doc]
				, ops : oprs
			}, this.template, this.el, true, cb);
				
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

			view.render(this.el.append.bind(this.el));

			// this.empty();
			// var docs = this.collection.toJSON().map(function(doc){
			// 	return {
			// 		op : doc.op
			// 		, fileName : doc.fileName
			// 		, length : doc.length
			// 		, id : doc.id
			// 	};
			// });
			// 
			// app.template({
			// 	documents : docs
			// 	, ops : ops
			// }, this.template, this.el[0]);

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

	Object.keys(ops).forEach(function(document, ops, k){
		retval.push({
			type : k
			, symbol : ops[k]
			, selected : document.op === k
		});
	}.bind(null, document, ops));

	return retval;

}
