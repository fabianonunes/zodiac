/*global define*/
define(['underscore', 'backbone'], function (_, Backbone) {

	var TextModel = Backbone.Model.extend({

		constructor : function TextModel () { // Correct name of instances
			return Backbone.Model.apply(this, arguments)
		},

		initialize : function (attrs, options) {
			_.bindAll(this)
			this.store = options.store
			this.performer = options.performer
			this.bind('change:op', this.perform)
		},

		perform : function () {
			return this.performer(this.expand).done(this.postPerform)
		},

		// when adding the properties to a queue, the values
		// must be the current values when invoking, not when added
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
			this.trigger('destroy', this)
			this.unbind()
		},

		acessor : function (op) {
			this.perform({ op : op, lines : this.store.data }).done(this.postPerform)
		},

		postPerform : function (data) {
			// for now, sort and uniq dont return lines
			if (!_.isUndefined(data.lines)) {
				this.store.write(data.lines)
			}

			this.set({ length : data.length })

			this.trigger('perform', this)
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

			_.bindAll(this)

			this.bind('perform', this.goNext)
			this.bind('destroy', this.destroy)

			this.storeFactory = options.store
			this.performer = options.performer

		},

		goNext : function (m) {
			var next = this.nextOf(m)
			if(next) {
				next.perform()
			} else {
				this.publish(m)
			}
		},

		destroy : function (m) {
			var next = this.nextOf(m)
			this.remove(m)
			if (this.length < 1) {
				this.reset()
			} else if (next) {
				next.perform()
			}
		},

		publish : function (m) {
			var self = this
			m.store.read().done(function (contents) {
				self.trigger('change:currentIndex', contents, m.id)
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
				performer  : this.performer
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
			return this.at(index + 1)
		},

		previousOf : function (model) {
			var index = this.indexOf(model)
			return this.at(index - 1)
		},

		clear : function () {
			this.forEach(function (m) {
				_.defer(m.destroy)
			})
			this.reset()
		}

	})

	return TextPeer

})
