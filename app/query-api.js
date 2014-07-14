'use strict';

var request = require('request');
var _ = require('underscore');

module.exports = function(url, searchOptions, callback) {
  var defaultSearchOptions = {
    '_search': true,
    'nd': Date.now(),
    'rows': 500,
    'page': 1,
    'filters': '{}'
  };

  searchOptions = _(defaultSearchOptions).extend(searchOptions);

  request({
    uri: url,
    method: 'POST',
    json: true,
    form: searchOptions
  }, function(err, res, body) {
    if (err) console.error(url, err);
    if (res.statusCode !== 200) console.error('HTTP', res.statusCode, url);

    callback(null, body);
  });
};
