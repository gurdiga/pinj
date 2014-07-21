'use strict';

var Q = require('q');
var request = require('request');

function httpPost(url, formData) {
  var deferred = Q.defer();

  request({
    uri: url,
    method: 'POST',
    json: true,
    form: formData
  }, function(err, res, body) {
    if (err) console.error(err, url, formData);
    if (res.statusCode !== 200) console.error('HTTP', res.statusCode, url, formData);

    deferred.resolve(body);
  });

  return deferred.promise;
}

module.exports = httpPost;
