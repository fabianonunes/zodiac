/*global define*/
define(['underscore', 'backbone', 'models/text'], function (_, Backbone, TextModel) {

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
			} else if (options.at === this.length) {
				this.publish()
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

			previous = this.get(previous) || this.last()

			this.add(m, {
				at : previous ? this.indexOf(previous) + 1 : 0,
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
