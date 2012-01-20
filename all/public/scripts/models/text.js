/*global define*/
define(['underscore', 'backbone'], function (_, Backbone) {

	var TextModel = Backbone.Model.extend({

		constructor : function TextModel () {
			return Backbone.Model.apply(this, arguments)
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
				if (undefined !== attrs.op) {
					return 'can\'t change op from accessors models'
				}
			}
		},

		perform : function (callback) {
			if ( this.collection.indexOf(this) === 0 && this.isAccessor() ) {
				this.destroy() // never perform accessor when first
			} else {
				this.performer(this.expand).done(this.postPerform, callback)
				this.trigger('perform', this)
			}
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
			this.trigger('destroy', this, {
				at : this.collection.indexOf(this)
			})
			this.unbind()
		},

		isAccessor : function () {
			return _.contains( TextModel.ACCESSORS, this.get('op') )
		}

	}, {
		ACCESSORS : ['sort', 'uniq'],
		NAMING : {
			uniq : 'Remover duplicados',
			sort : 'Ordenar'
		}
	})

	return TextModel

})