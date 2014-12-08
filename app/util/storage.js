'use strict';

var Storage = {};
module.exports = Storage;

var root = __dirname + '/../storage/';

Storage.set = function(key, value) {
  var filePath = getFilePath(key);

  preparePath(filePath);
  writeFile(filePath, serialize(value));
};

Storage.get = function(key) {
  var filePath = getFilePath(key);
  return deserialize(readFile(filePath));
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

var fs = require('fs');
var crypto = require('crypto');
var nodeFs = require('node-fs');
var path = require('path');
