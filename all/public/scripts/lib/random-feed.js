/*global define*/
define(['lib/randexp'], function (RandExp) {

	var Feeder = function Feeder (mask, length) {
		this.feed = new RandExp(mask)
		this.stack = []
		if(length) this.populate(length)
	}

	Feeder.prototype.populate = function (length) {
		this.stack = []
		while(length--) {
			this.stack.push( this.feed.gen() )
		}
	}

	Feeder.prototype.generate = function (min, max){
		var length = this._random(min, max)
		length = length || this._random(0, this.stack.length-1)
		var data = []
		while (length--) {
			data.push( this.stack.length ? Feeder.pick(this.stack) : this.feed.gen() )
		}
		return data
	}

	Feeder.prototype._random = function (min, max) {
		return ~~(Math.random() * (max - min) + min)
	}

	Feeder.pick = function (array) {
		var last = array.length-1
		var random = Math.round( Math.random() * last )
		return array[ Math.min(last,random) ]
	}

	return Feeder

})
