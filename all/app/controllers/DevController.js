var _ = require('underscore')
module.exports = require('./ApplicationController').extend()
	.methods({
		index: function () {
			this.render('dev')
		}
	});
