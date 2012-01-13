/*global describe it sinon expect define beforeEach afterEach*/
define(['underscore', 'jquery', 'models/text'], function (_ , $, Collection) {

	describe('Text Model', function () {

		var factory    = {
				write : _.identity,
				read : function () { return $.Deferred().resolve(' ') }
			},
			performer  = $.Deferred().resolve({ lines : [] , length : 0 }),
			collection = new Collection(null, {
				store     : function () { return factory },
				performer : function () { return performer }
			}),
			models

		beforeEach(function () {
			models = []
			_(5).times(function (n) {
				var m = collection.blend()
				models.push(m)
				sinon.spy(m, "postPerform")
			})
			sinon.spy(performer, "done")
		})

		afterEach(function () {
			if (performer.done.restore) performer.done.restore()
			collection.reset()
		})

		describe('collection', function () {

			it('should perform on blend', function () {
				var model = collection.blend()
				expect(performer.done.called).to.be.ok()
			})

			it('should blend new models at end', function () {
				var model0 = collection.last()
				var model1 = collection.blend()
				expect(collection.previousOf(model1).id).to.be(model0.id)
				expect(model1).to.be(collection.last())
			})

			it('should reorder on "insert at"', function () {
				var model1 = collection.nextOf(models[0])
				var model2 = collection.blend(null, null, models[0])
				expect(collection.nextOf(models[0]).id).to.be(model2.id)
				expect(collection.previousOf(model1).id).to.be(model2.id)
			})

			it('should perform when the first precedent perform', function () {
				models[0].perform()
				expect(models[1].postPerform.calledOnce).to.be.ok()
			})

			it('should perform all next models in order on perform', function () {
				models[0].perform()
				expect(performer.done.callCount).to.be(collection.length)
				collection.each(function (m) {
					var next = this.nextOf(m)
					if (next) {
						expect(m.postPerform.calledBefore(next.postPerform)).to.be.ok()
					}
				}, collection)
			})

			it('should trigger perform on next model when destroy', function () {
				models[0].destroy()
				expect(models[0].postPerform.called).to.not.be.ok()
				expect(models[1].postPerform.called).to.be.ok()
			})

			it('should trigger perform on next model when "insert at"', function () {
				collection.blend(null, null, models[0])
				expect(models[0].postPerform.called).to.not.be.ok()
				expect(models[1].postPerform.called).to.be.ok()
			})

			it('should publish only when the last model performs', function () {

				sinon.spy(collection, "publish")

				var last = collection.last()
				var trigger = sinon.spy(collection, "trigger")
				var lastTrigger = trigger.withArgs('change:currentIndex', ' ', last.id)

				collection.first().perform()

				expect(collection.publish.callCount).to.be(1)
				expect(collection.publish.calledWithExactly(collection.last())).to.be.ok()

				expect(lastTrigger.callCount).to.be(1)

				collection.publish.restore()
				collection.trigger.restore()

			})

		})

		describe('model', function () {

			it('should perform on {op} change', function () {
				models[0].set({op : 'op'})
				expect(models[0].postPerform.called).to.be.ok()
			})

			it('should fire perform custom event on perform', function () {
				var spy = sinon.spy();
				models[0].bind('perform', spy)
				models[0].perform()
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
