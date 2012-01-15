/*global define*/
define(['lib/vendor/underscore-1.3.0'], function (_) {
  _.mixin({
    proxy : function (func, context) {
      var args = Array.prototype.slice.call(arguments, 2)
      return function () {
        var cur = Array.prototype.slice.call(arguments)
        var bindArgs = [ context[func], context ]
        return _.bind.apply(null, bindArgs.concat(args, cur) )()
      }
    }
  })
  return _;
})
