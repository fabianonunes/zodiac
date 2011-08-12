(function(){

	app.UserView = Backbone.View.extend({

		tagName: 'tr',

		className: 'user',
		
		events: {
			'click .pencil': 'edit'
			, 'click .arrow-left': 'exitEditMode'
			, 'click .check': 'save'
			, 'keypress': 'saveOnEnter'
			, 'keydown': 'detectChanges'
		},

		template: 'tmpl-user',

		editTemplate: 'tmpl-edit-user',
		
		initialize: function(){

			_.bindAll(this, 'render');
			
			// re-render this row when its model changes
			this.model.bind('change', this.render);
			
			// give the model the view. this way, the model can remove
			// the associated view on destroy.
			this.model.view = this;
			
			// create a new details view
			// this.details = new app.DetailsView({
			// 	model: this.model,
			// 	prevRow: this
			// });

		},

		saveOnEnter: function( event ){

			event.which === 13 && this.save();
		},

		save: function(event){

			event && event.preventDefault();

			if(this.modified){
				this.model.save(this.serialize());
				this.modified = false;
			}
			
			this.exitEditMode();

		},

		serialize: function(){
			
			var r = {};

			this.$('input').each(function(k, input){

				input = $(input);

				r[input.attr('name')] = input.val();
				
			});

			return r;

		},

		detectChanges: function(event){
			
			if(event.which === 27){

				return this.exitEditMode();

			}

			this.modified = true;

		},

		edit: function(event){

			event.preventDefault();
			event.stopImmediatePropagation();
			this.editMode();

		},

		editMode: function() {

			app.template(this.el, this.model.toJSON(), this.editTemplate);
			
			this.inEditMode = true;

			this.$('input').first().focus();

			return this;
			
		},


		exitEditMode: function( event ){

			if( !this.inEditMode ){
				return true;
			}
			
			event && event.preventDefault();
			
			if( this.modified ){
				if( !confirm('Você fez algumas alterações. Continuar sem salvar?') ){
					return false;
				}
			}

			this.render();
			
			this.modified = false;
			this.inEditMode = false;
			
			return true;

		},		
		
		render: function(){
			app.template(this.el, this.model.toJSON(), this.template);
			return this;
		},
		
		show: function(){
			$(this.el).show();
		},
		
		hide: function(){
			$(this.el).hide();
		},
		
		deactivate: function(){
			$(this.el).removeClass('active');
		}
		
	});

})();
