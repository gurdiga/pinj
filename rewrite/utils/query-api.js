'use strict';

var assert = require('assert');
var Q = require('q');
var request = require('request');

function queryAPI(apiRequestOptions) {
  assert(!!apiRequestOptions, 'queryAPI: apiRequestOptions are required');
  assert('url' in apiRequestOptions, 'queryAPI: “url” member is required.');
  assert('searchOptions' in apiRequestOptions, 'queryAPI: “searchOptions” member is required');

  var requestOptions = {
    uri: apiRequestOptions.url,
    form: apiRequestOptions.searchOptions,
    method: 'POST',
    json: true
  };

  var deferred = Q.defer();

  request(requestOptions, passResponseDataTo(deferred));

  return deferred.promise;

  function passResponseDataTo(deferred) {
    return function(err, res, body) {
      if (err) console.error(err, apiRequestOptions);
      if (res.statusCode !== 200) console.error('HTTP', res.statusCode, apiRequestOptions);

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

module.exports = queryAPI;
