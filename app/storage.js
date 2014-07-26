'use strict';

var Storage = {};
var root = __dirname + '/storage/';

Storage.set = function(key, value) {
  var filePath = getFilePath(key);

  preparePath(filePath);
  writeFile(filePath, serialize(value));
};

Storage.get = function(key) {
  var filePath = getFilePath(key);
  return deserialize(readFile(filePath));
};

Storage.clear = function() {
  if (!fs.existsSync(root)) return;

  var filesNames = fs.readdirSync(root);

  filesNames.forEach(function(fileName) {
    fs.unlinkSync(root + '/' + fileName);
  });
};

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, {encoding: 'utf8'});
  } catch(e) {
    return undefined;
  }
}

function writeFile(filePath, value) {
  fs.writeFileSync(filePath, value);
}

function getFilePath(key) {
  var shasum = crypto.createHash('sha1');
  shasum.update(key);

  var fileName = shasum.digest('hex');
  return root + fileName + '.txt';
}

function serialize(value) {
  return JSON.stringify(value);
}

function deserialize(value) {
  try {
    return JSON.parse(value);
  } catch(e) {
    return undefined;
  }
}

function preparePath(filePath) {
  var mode = '0777';
  var recursive = true;

  return nodeFs.mkdirSync(path.dirname(filePath), mode, recursive);
}


(function selfTest() {
  var assert = require('assert');

  var key = 'test-key';
  var value = [{a: 1}, {a: 2}, {a: 3}];

  Storage.clear();
  Storage.set(key, value);
  assert.deepEqual(Storage.get(key), value, 'Storage can store and retrieve by key an array of objects');
  assert.strictEqual(Storage.get('unset'), undefined, 'Storage.get(key) returns undefined if key not found');

  Storage.clear();
  assert.strictEqual(Storage.get(key), undefined, 'Storage.clear() deletes everything');
}());


module.exports = Storage;

var fs = require('fs');
var crypto = require('crypto');
var nodeFs = require('node-fs');
var path = require('path');
