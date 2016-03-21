'use strict';

describe('agna-node-memwatch', function () {

  var _MemWatch = require('../MemWatch');

  it('should return with the same MemWatch instance if using new keyword or directly calling the constructor function', function () {

    var instance1 = _MemWatch();
    var instance2 = new _MemWatch();

    expect(instance1 instanceof _MemWatch).toBeTruthy();
    expect(instance2 instanceof _MemWatch).toBeTruthy();
    expect(instance1).toBe(instance2);
  });

  var memwatch = _MemWatch();
  var _Static = require('./library/Static');
  var _Prototype = require('./library/Prototype');
  var _StaticWildcard = require('./library/StaticWildcard');
  var _PrototypeWildcard = require('./library/PrototypeWildcard');

  describe('wrap method', function () {

    it('should throw an error on invalid target parameter', function () {
      expect(function () { memwatch.wrapHeapDiff('Invalid target!'); }).toThrowError(Error, '\'target\' argument has an invalid type, must be an object!');
    });

    it('should throw an error on invalid functionName parameter', function () {
      expect(function () { memwatch.wrapHeapDiff({}, 0); }).toThrowError(Error, '\'functionName\' argument has an invalid type, must be a string!');
    });

    it('should wrap a static function property with heapdiff functionality', function () {
      memwatch.wrapHeapDiff(_Static, 'test1');
      expect(_Static.test1()).toBe('Test 1 been called!');

      memwatch.wrapHeapDiff(_Static, 'test2');
      expect(_Static.test2('Yes!')).toBe('Test2 been called, parameter value was: Yes!');
    });

    it('should wrap a prototype based object instance\'s function property with heapdiff functionality', function () {

      memwatch.wrapHeapDiff(_Prototype.prototype, 'test1');
      memwatch.wrapHeapDiff(_Prototype.prototype, 'test2');
      memwatch.wrapHeapDiff(_Prototype.prototype, 'test3');

      var instance = new _Prototype();

      expect(instance.test1()).toBe('Test 1 been called!');
      expect(instance.test2('Yes!')).toBe('Test2 been called, parameter value was: Yes!');
      expect(instance.test3()).toBe('Test3 been called, object property value was: Yes!');
    });

    it('should wrap a static function property with heapdiff functionality using wildcard matching', function () {
      memwatch.wrapHeapDiff(_StaticWildcard, '*');

      expect(_StaticWildcard.test1()).toBe('Wildcard Test 1 been called!');
      expect(_StaticWildcard.test2('Yes!')).toBe('Wildcard Test2 been called, parameter value was: Yes!');
    });

    it('should wrap a prototype based object instance\'s function property with heapdiff functionalityusing wildcard matching', function () {
      memwatch.wrapHeapDiff(_PrototypeWildcard.prototype, '*');

      var instance = new _PrototypeWildcard();

      expect(instance.test1()).toBe('Wildcard Test 1 been called!');
      expect(instance.test2('Yes!')).toBe('Wildcard Test2 been called, parameter value was: Yes!');
      expect(instance.test3()).toBe('Wildcard Test3 been called, object property value was: Yes!');
    });

  });

  describe('on method', function () {

    var heapDiffStartCalls = 0;
    var heapDiffEndCalls = 0;

    function heapDiffStartHandler() {
      heapDiffStartCalls += 1;
    }

    function heapDiffEndHandler() {
      heapDiffEndCalls += 1;
    }

    beforeAll (function () {
      memwatch.on(_MemWatch.HEAP_DIFF_START, heapDiffStartHandler);
      memwatch.on(_MemWatch.HEAP_DIFF_END, heapDiffEndHandler);
    });

    // No wrapping because, we've done it in the previous tests.
    it('should catch heapdiff events on a static function property', function () {

      _Static.test1();
      expect(heapDiffStartCalls).toBe(1);
      expect(heapDiffEndCalls).toBe(1);

      _Static.test2();
      expect(heapDiffStartCalls).toBe(2);
      expect(heapDiffEndCalls).toBe(2);
    });

    // No wrapping because, we've done it in the previous tests.
    it('should catch heapdiff events on a prototype based object instance\'s function property', function () {

      var instance = new _Prototype();

      instance.test1();
      expect(heapDiffStartCalls).toBe(3);
      expect(heapDiffEndCalls).toBe(3);

      instance.test2();
      expect(heapDiffStartCalls).toBe(4);
      expect(heapDiffEndCalls).toBe(4);

      instance.test3();
      expect(heapDiffStartCalls).toBe(5);
      expect(heapDiffEndCalls).toBe(5);

    });

    it('should catch heapdiff events on a wildcard wrapped static function property', function () {
      _StaticWildcard.test1();
      expect(heapDiffStartCalls).toBe(6);
      expect(heapDiffEndCalls).toBe(6);

      _StaticWildcard.test2();
      expect(heapDiffStartCalls).toBe(7);
      expect(heapDiffEndCalls).toBe(7);
    });

    // No wrapping because, we've done it in the previous tests.
    it('should catch heapdiff events on a wildcard wrapped prototype based object instance\'s function property', function () {

      var instance = new _PrototypeWildcard();

      instance.test1();
      expect(heapDiffStartCalls).toBe(8);
      expect(heapDiffEndCalls).toBe(8);

      instance.test2();
      expect(heapDiffStartCalls).toBe(9);
      expect(heapDiffEndCalls).toBe(9);

      instance.test3();
      expect(heapDiffStartCalls).toBe(10);
      expect(heapDiffEndCalls).toBe(10);

    });

  });

});
