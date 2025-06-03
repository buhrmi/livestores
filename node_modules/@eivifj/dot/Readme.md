
# dot

  Get and set object properties with dot notation

## Installation

    $ npm install @eivifj/dot

## API

### dot.set(object, path, value)
```js
dot.set(obj, 'cool.aid', 'rocks');
assert(obj.cool.aid === 'rocks');
```

### dot.get(object, path)
```js
var value = dot.get(obj, 'cool.aid');
assert(value === 'rocks');
```

### dot.delete(object, path)
```js
var value = dot.delete(obj, 'cool.aid');
assert(!obj.cool.hasOwnProperty('aid'));
```

## License

  MIT
