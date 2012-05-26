/*global define*/
define([
	'jquery', 'underscore', 'backbone', 'lib/blob', 'lib/random-feed'
], function ($, _, Backbone, blob, Feeder) {

	return Backbone.View.extend({

		constructor : function FooterView () {
			Backbone.View.apply(this, arguments)
		},

		events : {
			'click .uniq'     : 'uniq',
			'click .sort'     : 'sort',
			'click .dups'     : 'dups',
			'click .random'   : 'random',
			'dragstart .icon' : 'dragstart'
		},

		initialize: function () {
			_.bindAll(this)
			this.$('.icon').attr('draggable', 'true')
		},

		_op : function (op) {
			var last = this.options.collection.last()
			if(last) this.options.collection.blend(op)
		},

		uniq : function () {
			this._op('uniq')
		},

		sort : function () {
			this._op('sort')
		},

		dups : function () {
			this._op('dups')
		},

		random : function () {

			var mask = /[1-9]\d{0,6}-\d{2}\.(199\d|20(0\d|1[0-2]))\.\d\.\d{2}\.\d{4}/
			var ops = ['union', 'difference', 'symmetric']
			var models = 10
			var feeder = new Feeder(mask, 10000)

			while(models--){
				var op = Feeder.pick(ops)
				var data = feeder.generate(1000, 10000).join('\n')
				this.options.collection.blend( op, blob.createBlob(data) )
			}


		},

		dragstart : function (evt) {
			evt = evt.originalEvent
			var op = $(evt.target).attr('class').split(' ')[0]
			evt.dataTransfer.effectAllowed = 'link'
			evt.dataTransfer.setData(
				'url',
				'data:application/json,' + encodeURIComponent(JSON.stringify({
					op : op
				}))
			)
		}

	})

})
