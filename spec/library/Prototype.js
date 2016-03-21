'use strict';

function Prototype() {
  this.test = 'Yes!';
}

Prototype.prototype.test1 = function () {
  return 'Test 1 been called!';
};

Prototype.prototype.test2 = function (aString) {
  return 'Test2 been called, parameter value was: ' + aString;
};

Prototype.prototype.test3 = function () {
  return 'Test3 been called, object property value was: ' + this.test;
};

module.exports = Prototype;