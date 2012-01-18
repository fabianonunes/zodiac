/*global define*/
define(['underscore', 'backbone'], function (_, Backbone) {

	var TextModel = Backbone.Model.extend({

		constructor : function TextModel () {
			return Backbone.Model.apply(this, arguments)
		},

		initialize : function (attrs, options) {
			_.bindAll(this)
			this.store = options.store
			this.performer = options.performer
			this.bind('change:op', this.perform)
		},

		perform : function () {
			var q = this.performer(this.expand).done(this.postPerform)
			this.trigger('perform', this)
			return q
		},

		postPerform : function (data) {
			if (data.lines) this.store.write(data.lines)
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
			options = options || {}
			if (this.length < 1) {
				this.reset()
			} else if (_.isNumber(options.at) ) {
				var next = this.at(options.at)
				if (next) next.perform()
			}
		},

		publish : function (m) {
			var self = this, last = this.last()
			last.store.read().done(function (contents) {
				self.trigger('publish', contents, last.id)
			})
		},

		blend : function (op, file, previous) {

			var m = new TextModel({
				id         : _.uniqueId('text'),
				op         : op,
				origin     : file,
				fileName   : file && file.name
			}, {
				collection : this,
				store      : this.storeFactory(),
				performer  : this.performer.perform
			})

			this.add(m, {
				at       : previous ? this.indexOf(this.get(previous)) + 1 : Number.MAX_VALUE,
				silent   : true
			})

			m.perform().done(
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
			models.reverse().forEach(function (m) {
				m.destroy()
			})
			this.reset()
		}

	})

	return TextPeer

})
