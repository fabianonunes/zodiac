
define([
	'jquery', 'underscore', 'backbone'
], function ($, _, Backbone) {

	return Backbone.View.extend({

		el: $('.path footer'),

		events : {
			'click .recycle' : 'reset'
		},

		initialize: function () {
			_.bindAll(this);
		},

		reset : function () {
			this.options.collection.clear();
		}

	});

});
