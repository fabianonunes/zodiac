/*global describe it sinon expect define beforeEach afterEach*/
define([
	'underscore', 'jquery', 'models/text.peer', 'test/lib/expect-jquery', 'backbone'
], function (_ , $, Collection, expect, Backbone) {

	describe('Text Model', function () {

		var factory    = {
				write : _.identity,
				resolved : $.Deferred().resolve(' '),
				read : function () { return this.resolved }
			},
			performer  = _.extend({
				resolved : $.Deferred().resolve({ lines : [] , length : 0 }),
				perform : function () { return performer.resolved }
			}, Backbone.Events),
			collection, mock

		beforeEach(function () {
			collection = new Collection(null, {
				store     : function () { return factory },
				performer : performer
			})
			mock = sinon.mock(collection)
			_(5).times(function (n) {
				sinon.spy(collection.blend(), "postPerform")
			})
			sinon.spy(performer.resolved, "done")
		})

		afterEach(function () {
			if (performer.resolved.done.restore) performer.resolved.done.restore()
			performer.unbind()
		})

		describe('collection', function () {

			it('should perform on blend', function () {
				var model = collection.blend()
				expect(performer.resolved.done.called).to.be.ok()
			})

			it('should blend new models at end', function () {
				var model0 = collection.last()
				var model1 = collection.blend()
				expect(model1).to.be(collection.last())
			})

			it('should reorder on "insert at"', function () {
				var model0 = collection.first()
				var model1 = collection.nextOf(model0)
				var model2 = collection.blend(null, null, model0)
				expect(collection.nextOf(model0)).to.be(model2)
				expect(collection.previousOf(model1)).to.be(model2)
			})

			it('should perform when the first precedent perform', function () {
				var first = collection.first()
				first.perform()
				expect(collection.nextOf(first).postPerform.calledOnce).to.be.ok()
			})

			it('should perform all next models in order on perform', function () {
				collection.first().perform()
				expect(performer.resolved.done.callCount).to.be(collection.length)
				collection.each(function (m) {
					var next = this.nextOf(m)
					if (next) expect(m.postPerform.calledBefore(next.postPerform)).to.be.ok()
				}, collection)
			})

			it('should trigger perform on next model when destroy', function () {
				var first = collection.first(), next = collection.nextOf(first)
				first.destroy()
				expect(next.postPerform.called).to.be.ok()
			})

			it('shouldn\'t perform on destroy', function () {
				var first = collection.first()
				first.destroy()
				expect(first.postPerform.called).to.not.be.ok()
			})

			it('should trigger perform on next model when "insert at"', function () {
				var first = collection.first()
				var next = collection.nextOf(first)
				collection.blend(null, null, first)
				expect(next.postPerform.called).to.be.ok()
			})

			it('should publish when performer completes', function () {
				mock.expects('publish').once()
				performer.trigger('complete')
				mock.verify()
			})

			it('should publish when last is destroyed', function () {
				mock.expects('publish').once()
				collection.last().destroy()
				mock.verify()
			})

			it('should trigger publish event with the last model', function () {
				mock.expects('trigger').withArgs('publish', ' ', collection.last().id)
				collection.publish()
				mock.verify()
			})

			it('shouldn\'t publish on reset', function () {
				mock.expects('publish').never(0)
				collection.clear()
				mock.verify()
			})

		})

		describe('model', function () {

			it('should perform on {op} change', function () {
				var first = collection.first()
				first.set({op : 'op'})
				expect(first.postPerform.called).to.be.ok()
			})

			it('shouldn\'t allow changes in op attr from accessor models', function () {
				var sort = collection.blend('sort')
				sort.set({ op : 'union' })
				expect(sort.get('op')).to.be('sort')
			})

			it('shouldn\'t allow adding accessor ops in sequence', function () {
				var sort = collection.blend('sort')
				var length = collection.length
				collection.blend('sort')
				expect(collection.length).to.be(length)
			})

			it('should destroy accessors models when first ', function () {
				var first = collection.first(),
					m = collection.blend('uniq', null, first.id)
				first.destroy()
				expect(collection.indexOf(m)).to.be(-1)
			})

			it('should fire perform custom event on perform', function () {
				var spy = sinon.spy()
				collection.first().bind('perform', spy).perform()
				expect(spy.called).to.be.ok()
			})

			it('should write data to store after perform', function () {
				var first = collection.first()
				sinon.spy(first.store, "write")
				first.perform()
				expect(first.store.write.called).to.be.ok()
			})

		})

	})

})
