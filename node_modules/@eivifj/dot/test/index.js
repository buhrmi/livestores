var assert = require('assert');
var dot = require('..');

var tests = (module.exports = {
  'test set': function() {
    var obj = {};
    var ret = dot.set(obj, 'cool.aid', 'rocks');
    assert(obj.cool.aid === 'rocks');
    assert(obj === ret);
  },

  'test get': function() {
    var obj = {};
    obj.cool = {};
    obj.cool.aid = 'rocks';
    var value = dot.get(obj, 'cool.aid');
    assert(value === 'rocks');
  },

  'test delete': function() {
    var obj = {};
    obj.cool = {};
    obj.cool.aid = 'rocks';
    obj.cool.hello = ['world'];
    dot.delete(obj, 'cool.aid');
    dot.delete(obj, 'cool.hello.0');
    assert(!obj.cool.hasOwnProperty('aid'));
    assert(obj.cool.hello.length == 0);
  },

  'test prototype pollution': function() {
    var obj = {};
    obj.cool = {};
    obj.cool.aid = 'rocks';
    obj.cool.hello = ['world'];
    dot.set(obj, '__proto__', 'test');
    dot.set(obj, '__proto__.toString', 'test');
    dot.set(obj, 'toString', 'test');
    dot.set(obj, 'cool.hello.__proto__', 'test');
    dot.set(obj, 'cool.hello.__proto__.toString', 'test');
    dot.set(obj, 'cool.hello.toString', 'test');
    assert(obj.__proto__ === {}.__proto__);
    assert(obj.toString === Object.prototype.toString);
    assert(obj.cool.hello.__proto__ === [].__proto__);
    assert(obj.cool.hello.toString === Array.prototype.toString);
    dot.delete(obj, '__proto__.toString', 'test');
    dot.delete(obj, '__proto__', 'test');
    dot.delete(obj, 'toString', 'test');
    dot.delete(obj, 'cool.hello.__proto__.toString', 'test');
    dot.delete(obj, 'cool.hello.__proto__', 'test');
    dot.delete(obj, 'cool.hello.toString', 'test');
    assert(obj.__proto__ === {}.__proto__);
    assert(obj.toString === Object.prototype.toString);
    assert(obj.cool.hello.__proto__ === [].__proto__);
    assert(obj.cool.hello.toString === Array.prototype.toString);
  }
});

for (var t in tests) {
  tests[t]();
}

console.log('All tests passed!');
