!function(){

	var ops = {
		union : '∪' ,
		intersection : '∩' ,
		difference : '∖' ,
		symmetric : '⊖'
	};

	app.PathView = Backbone.View.extend({

		el: $('.path'),
		template : 'path', 

		events : {
			'change select' : 'change'
		},

		initialize: function(){
			_.bindAll(this, 'render', 'change');
			this.collection.bind('change', this.render);
		},

		change : function(e){
			var select = $(e.target);
			var cid = select.attr('class');
			this.collection.getByCid(cid).set({op:select.val()});
		},

		render : function(){
			this.empty();
			app.template({
				documents : this.collection.toJSON()
				, ops : function(chunk, context, bodies){
					var document = context.current();
					var retval = [];
					Object.keys(ops).forEach(function(k){
						retval.push({
							type : k
							, symbol : ops[k]
							, selected : document.op === k
						});
					});
					return retval;
				}
			}, this.template, this.el[0]);
		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();