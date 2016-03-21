'use strict';

var Static = {
  test1: function () {
    return 'Test 1 been called!';
  },
  test2: function (aString) {
    return 'Test2 been called, parameter value was: ' + aString;
  }
};

module.exports = Static;