'use strict';

var Q = require('q');
var request = require('request');

function httpPost(url, formData) {
  var requestOptions = {
    uri: url,
    method: 'POST',
    json: true,
    form: formData
  };
  var deferred = Q.defer();

  request(requestOptions, passResponseDataTo(deferred));

  return deferred.promise;

  function passResponseDataTo(deferred) {
    return function(err, res, body) {
      if (err) console.error(err, url, formData);
      if (res.statusCode !== 200) console.error('HTTP', res.statusCode, url, formData);

      deferred.resolve(prepareBody(body));
    };
  }

  function prepareBody(body) {
    var emptyBody = { rows: [] };

    body = body || emptyBody;
    body.rows = body.rows || emptyBody.rows;

    return body;
  }
}

module.exports = httpPost;
