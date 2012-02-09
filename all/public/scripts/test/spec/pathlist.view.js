/*global describe it sinon expect define beforeEach afterEach*/
define([
	'underscore', 'jquery', 'expect', 'views/path', 'backbone'
], function (_ , $, expect, PathListView, Backbone) {

	describe('PathList View', function () {

		var el, path, mock,
		collection = _.extend({ indexOf : sinon.stub() }, Backbone.Events),
		model      = _.extend({ attributes : {} }, Backbone.Events)

		beforeEach(function () {
			path = new PathListView({ el : $('<div></div>'), collection : collection })
			el   = path.$el
			mock = sinon.mock(path)
			var saveexpect = mock.expects
			mock.expects = function () {
				var e = saveexpect.apply(this, arguments)
				path.$el.unbind()
				path.delegateEvents()
				return e
			}
		})

		afterEach(function () {
			el.remove()
		})

		it('should cancel event on dragover', function () {
			mock.expects('cancel').once()
			el.trigger('dragover')
			mock.verify()
		})

		it('should cancel event on drop', function () {
			mock.expects('cancel').once()
			el.trigger('drop')
			mock.verify()
		})

		it('should cancel event on dragenter', function () {
			mock.expects('cancel').once()
			el.trigger('dragenter')
			mock.verify()
		})

		it('should render a Path element when a Text Model is added', function () {
			collection.trigger('change:added', model)
			expect(el.children('div').length).to.be(1)
		})

		it('should render a Path element in order when adding in-the-middle', function () {
			collection.trigger('change:added', model)
			var first = el.children('div').first()[0]
			collection.indexOf.returns(0)
			collection.trigger('change:added', model)
			var last = el.children('div').get(-1)
			expect(first).to.be(last)
		})

		it('should clear on collection reset', function () {
			throw('Not implemented yet')
		})

	})

})
