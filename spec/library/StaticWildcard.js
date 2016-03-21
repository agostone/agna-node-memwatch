'use strict';

var StaticWildcard = {
  test1: function () {
    return 'Wildcard Test 1 been called!';
  },
  test2: function (aString) {
    return 'Wildcard Test2 been called, parameter value was: ' + aString;
  }
};

module.exports = StaticWildcard;
