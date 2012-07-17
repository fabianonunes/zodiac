/*global define*/
define([
	// 'lib/vendor/underscore-1.3.3',
	'lib/vendor/lo-dash-0.4.2'
], function (_) {
	"use strict";

	_.mixin({
		proxy : function (context, func) {
			var args = Array.prototype.slice.call(arguments, 2)
			return function () {
				var cur = Array.prototype.slice.call(arguments)
				var bindArgs = [ context[func], context ]
				return _.bind.apply(null, bindArgs.concat(args, cur) )()
			}
		},
		split : function (array, size) {
			var splitted = []
			array.forEach(function (value, index) {
				if (index % size === 0) {
					splitted.push([])
				}
				splitted[splitted.length-1].push(value)
			})
			return splitted
		}
	})
	return _;
})
