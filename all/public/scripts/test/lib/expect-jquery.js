/*global define*/
define(['jquery', 'test/lib/expect'], function (jQuery, expect) {

  var hasProperty = function(actualValue, expectedValue) {
    if (expectedValue === undefined) {
      return actualValue !== undefined;
    }
    return actualValue == expectedValue;
  };

	var assertProto = expect.Assertion.prototype

    assertProto.$haveClass = function (className) {
      this.assert(this.obj.hasClass(className))
      return this
    }

    assertProto.$visible = function () {
      this.assert(this.obj.is(':visible'))
      return this
    }

    assertProto.$hidden = function () {
      this.assert(this.obj.is(':hidden'))
      return this
    }

    assertProto.$selected = function () {
      this.assert(this.obj.is(':selected'))
      return this
    }

    assertProto.$checked = function () {
      this.assert(this.obj.is(':checked'))
      return this
    }

    assertProto.$empty = function () {
      this.assert(this.obj.is(':empty'))
      return this
    }

    assertProto.$exist = function () {
      this.assert(this.obj.size() > 0)
      return this
    }

    assertProto.$haveAttr = function (attributeName, expectedAttributeValue) {
      return hasProperty(this.obj.attr(attributeName), expectedAttributeValue)
    }

    assertProto.$haveId = function (id) {
      this.assert(this.obj.attr('id') == id)
      return this
    }

    assertProto.$haveHtml = function (html) {
      this.assert(this.obj.html() == jQuery('<div/>').append(html).html())
      return this
    }

    assertProto.$haveText = function (text) {
      if (text && jQuery.isFunction(text.test)) {
        return text.test(this.obj.text())
      } else {
        this.assert(this.obj.text() == text)
        return this
      }
    }

    assertProto.$haveValue = function (value) {
      this.assert(this.obj.val() == value)
      return this
    }

    assertProto.$haveData = function (key, expectedValue) {
      return hasProperty(this.obj.data(key), expectedValue)
    }

    assertProto.$be = function (selector) {
      this.assert(this.obj.is(selector))
      return this
    }

    assertProto.$contain = function (selector) {
      this.assert(this.obj.find(selector).size() > 0)
      return this
    }

    assertProto.$disabled = function (selector){
      this.assert(this.obj.is(':disabled'))
      return this
    }

    // tests the existence of a specific event binding
    assertProto.$handle = function (eventName) {
      var events = this.obj.data("events")
      return events && events[eventName].length > 0
    }

    // tests the existence of a specific event binding + handler
    assertProto.$handleWith = function (eventName, eventHandler) {
      var stack = this.obj.data("events")[eventName]
      var i
      for (i = 0; i < stack.length; i++) {
        if (stack[i].handler == eventHandler) {
          return true
        }
      }
      return false
    }

    return expect

})