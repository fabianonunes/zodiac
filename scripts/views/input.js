
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone){

	var InputView = Backbone.View.extend({

		el: $('.input'),

		events : {
			'dblclick' : 'selectText'
		},

		initialize: function(){

			_.bindAll(this, 'updateText', 'selectText', 'empty');

			this.collection.bind("change:currentIndex", this.updateText);
			this.collection.bind("reset", this.empty);

			var self = this;
			$('.sort').click(function(evt){
				self.collection.sortDocument();
			});
			$('.uniq').click(function(evt){
				self.collection.uniqDocument();
			});

		},

		selectText : function(){
			var range = document.createRange();
			range.selectNode(this.el[0]);
			window.getSelection().addRange(range);
		},

		updateText : function(id, model, html){

			this.el.empty();

			this.trigger('updated', 'view/' + id);

			var s = document.createElement('span');

			s.innerHTML = html || model.lines.join('\n');

			this.el[0].appendChild(s);

		},

		empty : function(){

			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}
		}

	});

	return InputView;

});
