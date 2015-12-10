'use strict';

module.exports = queryAPI;

function queryAPI(apiRequestOptions) {
  assert(!!apiRequestOptions, 'queryAPI: apiRequestOptions are required');
  assert('url' in apiRequestOptions, 'queryAPI: “url” member is required.');
  assert('searchOptions' in apiRequestOptions, 'queryAPI: “searchOptions” member is required');

  var requestOptions = {
    uri: apiRequestOptions.url,
    form: apiRequestOptions.searchOptions,
    method: 'POST',
    gzip: true,
    json: true
  };

  return Q.Promise(function(resolve, reject) {
    request(requestOptions, function(err, res, body) {
      if (err) {
        console.error(err, apiRequestOptions);
        reject(err);
        return;
      }

      res = res || {statusCode: -1};

      if (res.statusCode !== 200) {
        console.error('HTTP', res.statusCode, apiRequestOptions);
        process.exit(1);
      }

      resolve(prepareBody(body));
    });
  });
}

function prepareBody(body) {
  var emptyBody = { rows: [] };

  body = body || emptyBody;
  body.rows = body.rows || emptyBody.rows;

  return body;
}

var assert = require('assert');
var Q = require('q');
Q.longStackSupport = true;
var request = require('request');
