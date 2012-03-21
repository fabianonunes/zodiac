/*global define*/
define(function () {

	"use strict";

	function  sortBy (obj, field, context) {
		return obj.sort(function (left, right) {
			var a = parseInt(left[field], 10), b = parseInt(right[field], 10)
			return a < b ? -1 : a > b ? 1 : 0
		})
	}

	var operations = {

		sort : function (lines2) {

			var value  = '',
				length = 0

			var strut = lines2.map(function (v) {
				return { line : v }
			})

			strut = sortBy(strut, 'line')

			strut.forEach(function (row) {
				value += row.line
				value += '\n'
				length += 1
			})

			return {
				lines : value,
				length : length
			}

		},

		uniq : function (lines2) {

			var strut  = {},
				length = 0,
				value = ''

			lines2.forEach(function (row) {

				if (!strut[row]) {
					strut[row] = true
					value += row
					value += '\n'
					length += 1
				}

			})

			return {
				lines : value,
				length : length
			}

		},

		dups : function (lines2) {

			var value = '',
				length = 0,
				o = {}

			lines2.forEach(function (v) {
				o[v] = +[o[v]] + 1
			})

			Object.keys(o).forEach(function (v) {
				if (o[v] > 1) {
					value += v
					value += '\n'
					length += 1
				}
			})

			return {
				lines : value,
				length : length
			}

		},

		difference : function (lines2, lines1) {

			var value = '',
				length = 0,
				uq = {}

			lines1.forEach(function (v) {
				uq[v] = true
			})

			lines2.forEach(function (v) {
				if (!uq[v]) {
					value += v
					value += '\n'
					length += 1
				}
			})

			return {
				lines : value,
				length : length
			}

		},

		union : function (lines2, lines1) {

			var value = lines1.concat(lines2)

			return {
				lines : value.join('\n'),
				length : value.length
			}

		},

		intersection : function (lines2, lines1) {

			var value = '',
				length = 0,
				o     = {}, v

			lines2.forEach(function (v, k) {
				o[v] = true
			})

			lines1.forEach(function (v) {
				if (o[v] === true) {
					// avoid duplicate lines
					o[v] = false
					value += v
					value += '\n'
					length += 1
				}
			})

			return {
				lines : value,
				length : length
			}

		},

		symmetric : function (lines2, lines1) {

			var value = '',
				length = 0,
				o = {},
				v

			lines2.forEach(function (v) {
				o[v] = +[o[v]] + 1
			})

			lines1.forEach(function (v) {
				o[v] = +[o[v]] + 1
			})

			Object.keys(o).forEach(function (v) {
				if (o[v] === 1) {
					value += v
					value += '\n'
					length += 1
				}
			})

			return {
				lines : value,
				length : length
			}


		},

		charge : function (lines2, lines1) {

			return {
				lines : lines1.join('\n'),
				length : lines1.length
			}

		},

		grep : function (lines2, lines1) {

			var value = '',
				length = 0,
				uq = {}

			var regexes = lines1.map(function (v) {
				return new RegExp(v, "i")
			})

			lines2.forEach(function (original) {

				var v
				v = original

				var found = regexes.some(function (r) {
					return v !== (v = v.replace(r, '<b>$&</b>'))
				})

				if (found) {
					value += original
					value += '\n'
					length += 1
				}

			})

			return {
				lines : value,
				length : length
			}

		}

	}

	return operations

})