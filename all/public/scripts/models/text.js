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

	var TextPeer = Backbone.Collection.extend({

		currentIndex : null,
		model        : TextModel,
		// TODO: decouple this
		mask         : /[1-9]\d{0,6}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}/g,

		constructor : function TextPeer () {
			return Backbone.Collection.apply(this, arguments)
		},

		initialize : function (models, options) {

			var self = this

			_.bindAll(this)

			this.bind('perform', this.goNext)
			this.bind('destroy', this.destroy)

			this.storeFactory = options.store
			this.performer = options.performer

			this.performer.bind('complete', _.proxy(this, 'publish'))

		},

		goNext : function (m) {
			var next = this.nextOf(m)
			if(next) next.perform()
		},

		destroy : function (m, options) {
			if ( this.length === 0 ) {
				this.reset()
			} else {
				options = options || {}
				var next = this.at(options.at)
				if (next) next.perform()
			}
		},

		publish : function () {
			// TODO : publish when the last is destroyed
			var self = this, last = this.last()
			last.store.read().done(function (contents) {
				self.trigger('publish', contents, last.id)
			})
		},

		blend : function (op, file, previous) {

			var m = new TextModel({
				id         : _.uniqueId('text'),
				op         : op,
				name       : file ? file.name : TextModel.NAMING[op],
				origin     : file
			}, {
				collection : this,
				store      : this.storeFactory(),
				performer  : this.performer.perform
			})

			this.add(m, {
				at : previous ? this.indexOf(this.get(previous)) + 1 : Number.MAX_VALUE,
				silent : true
			})

			m.perform(
				_.bind(m.trigger, m, 'change:added', m)
			)

			return m

		},

		nextOf : function (model) {
			var index = this.indexOf(model)
			return ~index ? this.at(index + 1) : null
		},

		previousOf : function (model) {
			var index = this.indexOf(model)
			return ~index ? this.at(index - 1) : null
		},

		clear : function () {
			var models = []
			this.forEach(function (m) {
				models.push(m)
			})
			// reversing prevent perform-next in each exclusion
			models.reverse().forEach(function (m) {
				m.destroy()
			})
			this.reset()
		}

	})

	return TextPeer

})
