/**
 * Model: contact
 */
app.Unidade = Backbone.Model.extend({
	
	defaults: {
		nome: '',
		emails: []
	},
	
	// returns an array of invalid fields
	validate: function( attrs ){
		
		return;
		
		var errors = [];
		
		if( !$.trim(attrs.firstname).length ) errors.push('firstname');
		if( !$.trim(attrs.lastname).length ) errors.push('lastname');
		
		if( errors.length ){
			return errors;
		}
		
	},
	
	clear: function(){
		this.destroy();
		this.view.remove();
	}
	
});
