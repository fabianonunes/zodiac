define([
	'jquery', 'underscore', 'backbone', 'libs/base64', 'renderer'
], function($, _, Backbone, b64, renderer){

	var PathView = Backbone.View.extend({

		tagName : 'div',

		events : {
			'click .remove' : 'destroy',
			'click .icon' : 'click',
			'dragstart' : 'drag'
		},

		template : 'path', 

		initialize : function(){
			
			_.bindAll(this, 'render', 'destroy', 'click');

			this.model.bind('change', this.render);

			$(this.el).attr('draggable', 'true');

			this.model.view = this;

		},

		click : function(evt){

			$(this.el).parent().find('.options').css({height:0});

			var options = $(this.el).find('.options');
			options.show().css({
				height : options.height() > 0 ? 0 : options[0].scrollHeight
			});

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

			// TODO: quando a operaçao é alterada, o evento change
			// é chamado duas vezes: uma para o attr [op] e outra
			// para o atributo [length];

			var changed = this.model.changedAttributes(),
			el = $(this.el);

			if(changed === false){

				var dfd = $.Deferred();

				var doc = {
					op : this.model.get('op'),
					previous : this.model.getPrevious(),
					fileName : this.model.get('fileName'),
					length : this.model.get('length'),
					id : this.model.id
				};

				el.empty();
				
				renderer({
					documents : [doc],
					ops : oprs
				}, this.template, this.el, dfd.resolve.bind(dfd, this.el));

				return dfd.promise();

			} else {

				var keys = Object.keys(changed);

				if(~keys.indexOf('op')){
					var op = this.model.get('op');
					el.find('.row .icon').attr('class', 'icon ' + op);
					el.find('.true').removeClass('true');
					el.find('.options .' + op).addClass('true');
				}

				if(~keys.indexOf('length')){
					el.find('.counter').text(changed.length);
				}
				




			}

		}

	});

	var PathListView = Backbone.View.extend({

		el: $('.path'),
		template : 'path', 

		events : {
			'click .options .icon' : 'change'
		},

		initialize: function(){
			_.bindAll(this, 'render', 'change');
			this.collection.bind('change:added', this.render);
		},

		change : function(e){
			var select = $(e.target),
			op = select.attr('class').split(' ')[0],
			id = select.text();
			this.collection.get(id).set({ op : op });
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

	return PathListView;

});


