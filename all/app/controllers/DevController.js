module.exports = require('./ApplicationController').extend()
	.methods({
		index: function () {
			this.response.render('dev');
		}
	});