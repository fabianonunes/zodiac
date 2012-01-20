/*global define*/
define([
	'jquery', 'underscore', 'backbone'
], function ($, _, Backbone) {

	return Backbone.View.extend({

		constructor : function ToolbarView () {
			return Backbone.View.apply(this, arguments);
		},

		events : {
			'click .recycle' : 'reset',
			'click .plus' : 'uniq'
		},

		initialize: function () {
			_.bindAll(this);
		},

		reset : function () {
			this.options.collection.clear();
		},

		uniq : function () {
			this.options.collection.blend('uniq')
		}

	});

});
