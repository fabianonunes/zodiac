/*global describe it sinon expect define beforeEach afterEach*/
define([
	'underscore', 'jquery', 'test/lib/expect-jquery', 'views/input', 'backbone'
], function (_ , $, expect, Input, Backbone) {

	describe('Input View', function () {
		var el, input, collection = _.extend({ blend : sinon.stub() }, Backbone.Events);

		beforeEach(function () {
			el = $('<div>__start__</div>')
			input = new Input({ el : el, collection : collection })
		})

		afterEach(function () {
			el.remove()
		})

		it('should update element contents on collection\'s "currentIndex" changes', function () {
			sinon.spy(input, 'updateText')
			collection.trigger('change:currentIndex', 'text')
			expect(input.updateText.callCount).to.be(1)
			expect(input.updateText.calledWith('text')).to.be.ok()
			expect(el.html()).to.be('text')
		})

		it('should empty elment on collection\'s reset', function () {
			collection.trigger('reset')
			expect(el.html()).to.be.empty()
		})

		it('should empty element on updateText', function () {
			sinon.stub(el, 'empty')
			collection.trigger('change:currentIndex', 'newText')
			expect(el.empty.callCount).to.be(1)
		})

		it('should clear queue when a new update is requested', function () {
			sinon.spy(input.queue, 'clear')
			collection.trigger('change:currentIndex', 'text')
			expect(input.queue.clear.callCount).to.be(1)
		})

	})

})
