/*global define*/
define([
	'jquery', 'underscore', 'backbone', 'lib/randexp', 'lib/blob'
], function ($, _, Backbone, RandExp, blob) {

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
			var rer = new RandExp(/[1-9]\d{0,6}-\d{2}\.(199\d|20(0\d|1[0-2]))\.\d\.\d{2}\.\d{4}/)
			var bounds = [1000, 10000]
			var initial = bounds[1] - bounds[0]
			var numbers = []

			while(initial--){
				numbers.push(rer.gen())
			}

			var ops = ['union', 'difference', 'symmetric']

			var models = 10

			while(models--){
				var length = ~~(Math.random() * (bounds[1] - bounds[0]) + bounds[0])
				var op = ops[Math.round(Math.random() * (ops.length-1))]
				var data = ''
				while (length--) {
					data += numbers[~~(Math.random() * (bounds[1] - bounds[0]) + bounds[0])]
					data += '\n'
				}
				this.options.collection.blend(op, blob.createBlob(data))
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
