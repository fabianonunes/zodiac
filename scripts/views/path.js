define([
	'jquery', 'underscore', 'backbone', 'libs/base64', 'renderer'
], function($, _, Backbone, b64, renderer){

	var PathView = Backbone.View.extend({

		tagName : 'div',

		events : {
			'click .remove' : 'destroy',
			'dragstart' : 'drag'
		},

		template : 'path', 

		initialize : function(){
			
			_.bindAll(this, 'render', 'destroy');

			this.model.bind('change', this.render);

			$(this.el).attr('draggable', 'true');

			this.model.view = this;

		},

		drag : function(event){
			event = event.originalEvent;
			event.dataTransfer.setData(
				'DownloadURL',
				'text/plain:' + this.model.getPath() +
					'.txt:data:text/plain;base64,' +
					b64.encode(this.model.lines.join('\n'))
			);
		},

		destroy : function(){
			this.unbind();
			this.remove();
			this.model.destroy();
		},

		render : function(){

			var dfd = $.Deferred();

			var doc = {
				op : this.model.get('op'),
				previous : this.model.getPrevious(),
				fileName : this.model.get('fileName'),
				length : this.model.get('length'),
				id : this.model.id
			};

			$(this.el).empty();
			
			renderer({
				documents : [doc],
				ops : oprs
			}, this.template, this.el, dfd.resolve.bind(dfd, this.el));

			return dfd.promise();

		}

	});

	var PathListView = Backbone.View.extend({

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
			new PathView({ model : model })
			.render()
			.then(this.el.append.bind(this.el));
		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}
		}

	});

	return PathListView;

});

function oprs(chunk, context, bodies){

	var ops = {
		union : '∪' ,
		intersection : '∩' ,
		difference : '∖' ,
		symmetric : '⊖',
		grep : '*'
	};

	var document = context.current(), retval = [];

	Object.keys(ops).forEach(function(k){
		retval.push({
			type : k,
			symbol : ops[k],
			selected : document.op === k
		});
	});

	return retval;

}
