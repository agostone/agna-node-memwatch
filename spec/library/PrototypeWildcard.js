'use strict';

function PrototypeWildcard() {
  this.test = 'Yes!';
}

PrototypeWildcard.prototype.test1 = function () {
  return 'Wildcard Test 1 been called!';
};

PrototypeWildcard.prototype.test2 = function (aString) {
  return 'Wildcard Test2 been called, parameter value was: ' + aString;
};

PrototypeWildcard.prototype.test3 = function () {
  return 'Wildcard Test3 been called, object property value was: ' + this.test;
};

module.exports = PrototypeWildcard;