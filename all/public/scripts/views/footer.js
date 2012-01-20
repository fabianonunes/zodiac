/*global define*/
define([
	'jquery', 'underscore', 'backbone'
], function ($, _, Backbone) {

	return Backbone.View.extend({

		constructor : function FooterView () {
			return Backbone.View.apply(this, arguments);
		},

		events : {
			'click .uniq' : 'uniq',
			'click .sort' : 'sort'
		},

		initialize: function () {
			_.bindAll(this);
		},

		_op : function (op) {
			var last = this.options.collection.last()
			if(last) this.options.collection.blend(op)
		},

		uniq : function () {
			this._op('uniq')
		},

		sort : function () {
			this._op('sort')
		}

	});

});
