/*global define*/
define(['underscore', 'backbone'], function (_, Backbone) {

	var TextModel = Backbone.Model.extend({

		constructor : function TextModel () {
			Backbone.Model.apply(this, arguments)
		},

		initialize : function (attrs, options) {
			_.bindAll(this)
			options = options || {}
			this.store = options.store
			this.performer = options.performer
			this.bind('change:op', this.perform)
			this.set({ operable : !this.isAccessor() })
		},

		validate : function (attrs) {
			if ( this.isAccessor() ) {
				if (this.get('op') !== attrs.op) {
					return 'can\'t change op from accessors models'
				}
			}
		},

		perform : function (callback) {
			if ( this.isAccessor() ) {
				var previous = this.collection.previousOf(this)
				if (!previous || previous.get('op') === this.get('op') ) {
					return this.destroy() // never perform accessor when first or is duplicate
				}
			}
			this.performer(this.expand).done(this.postPerform, callback)
			this.trigger('perform', this)
		},

		postPerform : function (data) {
			if ( undefined !== data.lines ) this.store.write(data.lines)
			this.set({ length : data.length })
		},

		expand : function () {
			var previous = this.collection.previousOf(this)
			return {
				op       : previous ? this.get('op') : 'charge',
				previous : previous && previous.store.data,
				file     : this.get('origin'),
				mask     : this.collection.mask
			}
		},

		destroy : function (options) {
			options = options || {}
			options.at = this.collection.indexOf(this)
			this.trigger('destroy', this, options)
			this.unbind()
		},

		isAccessor : function () {
			return _.contains( TextModel.ACCESSORS, this.get('op') )
		}

	}, {
		ACCESSORS : ['sort', 'uniq', 'dups'],
		NAMING : {
			uniq : 'Remover duplicados',
			sort : 'Ordenar',
			dups : 'Duplicados'
		}
	})

	return TextModel

})