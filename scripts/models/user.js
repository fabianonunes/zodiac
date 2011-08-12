
app.User = Backbone.Model.extend({

	Collection: app.UserCollection,
	
	defaults: {
		nome: '',
		email: '',
		twitter: '',
		mobile: '',
		unidade: ''
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

app.UserCollection = Backbone.Collection.extend({
	url: '/users'
	, model: app.User
	, renderMode: 'default'
});
