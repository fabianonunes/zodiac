/**
 * Model: contact
 */
app.Shipment = Backbone.Model.extend({
	
	defaults: {
		sentAt: '',
		message: '',
		to: ''
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
