/**
 * Set given `path`
 *
 * @param {Object} obj
 * @param {String} path
 * @param {Mixed} val
 * @return {Object}
 * @api public
 */

exports.set = function(obj, path, val) {
  var segs = path.split('.');
  var attr = segs.pop();
  var src = obj;

  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i];
    if (!isSafe(obj, seg)) return src;
    obj[seg] = obj[seg] || {};
    obj = obj[seg];
  }

  if (isSafe(obj, attr)) {
    obj[attr] = val;
  }

  return src;
};

/**
 * Get given `path`
 *
 * @param {Object} obj
 * @param {String} path
 * @return {Mixed}
 * @api public
 */

exports.get = function(obj, path) {
  var segs = path.split('.');
  var attr = segs.pop();

  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i];
    if (!obj[seg]) return;
    obj = obj[seg];
  }

  return obj[attr];
};

/**
 * Delete given `path`
 *
 * @param {Object} obj
 * @param {String} path
 * @return {Mixed}
 * @api public
 */

exports.delete = function(obj, path) {
  var segs = path.split('.');
  var attr = segs.pop();

  for (var i = 0; i < segs.length; i++) {
    var seg = segs[i];
    if (!obj[seg]) return;
    if (!isSafe(obj, seg)) return;
    obj = obj[seg];
  }

  if (!isSafe(obj, attr)) return;

  if (Array.isArray(obj)) {
    obj.splice(attr, 1);
  } else {
    delete obj[attr];
  }
};

function isSafe(obj, prop) {
  if (isObject(obj)) {
    return obj[prop] === undefined || hasOwnProperty(obj, prop);
  }

  if (Array.isArray(obj)) {
    return !isNaN(parseInt(prop, 10));
  }

  return false;
}

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
