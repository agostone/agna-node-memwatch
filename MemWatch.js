'use strict';

var _ = require('lodash');
var _MemWatch = require('memwatch-next');
var _EventEmitter = require('events').EventEmitter;
var _inherits = require('util').inherits;

var _instance = void 0;

/**
 * @module agna-node-memwatch
 * @class
 */
function MemWatch() {

  // Making it a singleton, while making it possible to extend MemWatch via prototype.
  // No mater if you call new MemWatch() or MemWatch(), you'll get the same instance back.
  if (_instance === void 0) {
    if (!(this instanceof MemWatch)) {
      new MemWatch();
    } else {

      // Public properties
      this.separator = '.';
      this.wildcard = '*';

      _EventEmitter.call(this);

      _instance = this;
    }
  }

  return _instance;
}

_inherits(MemWatch, _EventEmitter);

/**
 * Registers an event listener.
 *
 * @param {string} event
 * @param {Function} listener
 * @returns {MemWatch}
 */
MemWatch.prototype.on = function (event, listener) {
  switch (event) {
    case MemWatch.LEAK: // MemWatch events
    case MemWatch.STATS:
      _MemWatch.on(event, listener);
      break;
    default: // Own events
      _EventEmitter.prototype.on.call(this, event, listener);
      break;
  }

  return this;
};

MemWatch.HeapDiff = _MemWatch.HeapDiff;

/**
 * Wraps a desired function with heap difference calculation.
 *
 * @param {Object} target
 * @param {string} functionName
 * @return {*}
 */
MemWatch.prototype.wrapHeapDiff = function (target, functionName) {

  if (!_.isObject(target)) {
    throw Error('\'target\' argument has an invalid type, must be an object!');
  }

  if (!_.isString(functionName)) {
    throw Error('\'functionName\' argument has an invalid type, must be a string!');
  }

  var targetObject = functionName.split(this.separator);
  var targetFunctionName = targetObject.pop();
  var wildcard = this.wildcard;

  targetObject = _.isEmpty(targetObject) ? target : _.get(target, targetObject, void 0);

  if (_.isUndefined(targetObject) ||
      (targetFunctionName !== wildcard &&
        (!_.has(targetObject, targetFunctionName) || !_.isFunction(targetObject[targetFunctionName]))
      )
  ) {
    throw Error('Requested function \'' + functionName + '\' cannot be found!');
  }

  if (targetFunctionName === wildcard) {
    targetFunctionName = _.functions(targetObject);
  } else {
    targetFunctionName = [targetFunctionName];
  }

  var self = this;
  _.forEach(targetFunctionName, function targetFunctionNameIterator(targetFunctionName) {
    var objectFunction = targetObject[targetFunctionName];
    targetObject[targetFunctionName] = function functionWrapper() {
      var returnValue = void 0;
      self.emit(MemWatch.HEAP_DIFF_START, target, functionName);
      var heapDiff = new _MemWatch.HeapDiff();
      returnValue = objectFunction.apply(this, arguments);
      self.emit(MemWatch.HEAP_DIFF_END, target, functionName, heapDiff.end());
      return returnValue;
    };
  });
};

MemWatch.HEAP_DIFF_START = 'heapDiffStart';
Object.defineProperty(MemWatch, 'HEAP_DIFF_START', { writeable: false });

MemWatch.HEAP_DIFF_END = 'heapDiffEnd';
Object.defineProperty(MemWatch, 'HEAP_DIFF_END', { writeable: false });

MemWatch.LEAK = 'leak';
Object.defineProperty(MemWatch, 'LEAK', { writeable: false });

MemWatch.STATS = 'stats';
Object.defineProperty(MemWatch, 'STATS', { writeable: false });

module.exports = MemWatch;
