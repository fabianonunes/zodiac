!function(){

	app.InputView = Backbone.View.extend({

		el: $('.input'),

		events : {
			'click' : 'selectText'
		},

		initialize: function(){

			_.bindAll(this, 'updateText', 'selectText');

			this.collection.bind("change:currentIndex", this.updateText);

			var self = this;
			$('.button').click(function(evt){
				self.collection.sortDocument();
			})

		},

		selectText : function(){
			var range = document.createRange();
			range.selectNode(this.el[0]);
			window.getSelection().addRange(range);						
		},

		updateText : function(cid, model, html){

			this.el.empty();

			this.trigger('updated', 'view/' + cid);

			if( !_.isEmpty(html) ){

				var s = document.createElement('span');
				s.innerHTML = html;
				this.el[0].appendChild(s);

			} else {
				//TODO : optimize
				this.el.html(model.lines.join('\n'));
			}

		},

		empty : function(){

			while(this.el[0].firstChild){
				this.el[0].removeChild(this.el[0].firstChild);
			}		
		}

	});

}();
