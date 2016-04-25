# agna-node-memwatch
An extension of Memwatch-next (https://www.npmjs.com/package/memwatch-next).

## Features
- Dynamic wrapping of HeapDiff calculation around existing module/object functions.

## Installation
$ npm install git://github.com/agostone/agna-node-memwatch.git --save-dev

## Usage

### Getting the memwatch instance
agna-node-memwatch uses the singleton pattern, meaning you'll always get the same instance.

```js
var Memwatch = require('agna-node-memwatch');
var instance = Memwatch();
```
or
```js
var Memwatch = require('agna-node-memwatch');
var instance = new Memwatch();
```

### Wrapping
```js
memwatch.wrapHeapDiff(<target>, <functionName>);
```

#### target
Should be a valid javascript object.

#### functionName
Should be a string pointing to a valid function on target. 
Sub-property references are allowed.

For example:
To wrap MyObject.SubObject.Function:
```js
memwatch.wrapHeapDiff(MyObject, 'SubObject.Fuction');
```
or
```js
memwatch.wrapHeapDiff(MyObject, ['SubObject','Fuction']);
```
For more possibilities check the path parameter here: https://lodash.com/docs#get

#### Wildcards
If you wish all functions of an object to be wrapped, simply use '*' for functionName.
```js
var WrapAll = {
  function1: function () {},
  function2: function () {},
  function3: function () {}
};

memwatch.wrapHeapDiff(WrapAll, '*');
```
In the above example function1, function2 and function3 will get wrapped.

```js
var WrapAll = {
  all: {
    function4: function () {},
    function5: function () {},
    function6: function () {}
  }
};

memwatch.wrapHeapDiff(WrapAll, 'all.*');
```
In the above example function4, function5 and function6 will get wrapped.

For more information on how anga-node-memwatch determines the functions to wrap, look here: https://lodash.com/docs#functions 

### Adding event listeners
```js
memwatch.on(<eventName>, <callback>);
```

#### Valid events

#### MemWatch.HEAP_DIFF_START
Fired before heap difference calculation starts.

The callback method registered for this event should have two parameters.
One receiving the target object, the other the functionName string.
```js
function heapStartCallback(target, functionName) {
}
```

#### MemWatch.HEAP_DIFF_END
Fired after heap difference calculation ends.

The callback method registered for this even should have three parameters.
First one receiving the target object, second the functionName string and the third the calculation result object.
```js
function heapEndCallback(target, functionName, diffResult) {
}
```

#### MemWatch.LEAK
Fired when a possible lead detection been made.
For more information check the "Leak Detection" section here: https://www.npmjs.com/package/memwatch-next 

#### MemWatch.STATS
Heap usage statistics event fired at V8 garbage collection.
For more information check the "Heap Usage" section here: https://www.npmjs.com/package/memwatch-next 

## Running the tests
$ jasmine

## Creating the docs
$ jsdoc --verbose -c ./jsdoc/configuration.json MemWatch.js

## Future development?
- More sophisticated wildcarding. How about rexep? How about sub-property wildcarding?
- How about ES6ifying? =}
- rubberduck for wrapping? =}

## Licensing
agna-node-memwatch is free software.
It comes without any warranty, to the extent permitted by applicable law.
You can redistribute it and/or modify it under the terms of the 
Do What The Fuck You Want To Public License, Version 2, as published by Sam Hocevar.
See http://www.wtfpl.net/ for more details.