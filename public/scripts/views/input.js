
define([
	'jquery', 'underscore', 'backbone'
], function($, _, Backbone){

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
				self.collection.acessor('sort');
			});
			$('.uniq').click(function(evt){
				self.collection.acessor('uniq');
			});

		},

		selectText : function(){
			var range = document.createRange();
			range.selectNode(this.el[0]);
			window.getSelection().addRange(range);
		},

		updateText : function(id, model, html){

			var self = this;

			self.trigger('updated', 'view/' + id);

			_.defer(function(){
				self.el.empty();
				html = html || model.lines.join('\n');
				self.el[0].insertAdjacentHTML(
					'beforeend',
					'<span>' + html + '</span>'
				);
				// var s = document.createElement('span');
				// s.innerHTML = html || model.lines.join('\n');
				// self.el[0].appendChild(s);
			});

		},

		empty : function(){
			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}
		}

	});

	return InputView;

});
