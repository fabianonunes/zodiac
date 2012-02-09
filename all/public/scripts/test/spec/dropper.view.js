/*global describe it sinon expect define beforeEach afterEach*/
define([
	'underscore', 'jquery', 'expect', 'views/dropper', 'backbone'
], function (_ , $, expect, Dropper, Backbone) {

	describe('Dropper View', function () {

		var el, dropper, mock, collection = { blend : sinon.stub() }

		beforeEach(function () {
			dropper = new Dropper({
				el : $('<div><div class=mask><div class="op icon"/></div></div>'),
				collection : collection
			})
			el = dropper.$el
			mock = sinon.mock(dropper)
			var saveexpect = mock.expects
			mock.expects = function () {
				var e = saveexpect.apply(this, arguments)
				dropper.$el.unbind()
				dropper.delegateEvents()
				return e
			}
		})

		afterEach(function () {
			mock.restore()
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

		it('should show mask on dragenter', function () {
			el.trigger('dragenter')
			expect(dropper.mask.css('display')).to.not.be('none')
		})

		it('should hide mask on dragleave', function () {
			el.trigger('dragleave')
			expect(dropper.mask.css('display')).to.be('none')
		})

		it('should highlight ops on dragenter', function () {
			var op = dropper.$('.op')
			op.trigger('dragenter')
			expect(op).to.cssclass('over')
		})

		it('should de-highlight ops on dragleave', function () {
			var op = dropper.$('.op')
			op.trigger('dragleave')
			expect(op).to.not.cssclass('over')
		})

		it('should blend models on op drop', function () {
			var op = dropper.$('.op')
			op.trigger('drop')
			expect(collection.blend.callCount).to.be(1)
			expect(collection.blend.calledWith('op')).to.be.ok()
		})

	})

})
