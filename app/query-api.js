'use strict';

var request = require('request');
var _ = require('underscore');

module.exports = function(url, searchOptions, callback) {
  var defaultSearchOptions = {
    '_search': true,
    'nd': Date.now(),
    'rows': 50,
    'page': 1,
    'filters': '{}'
  };

  searchOptions = _(defaultSearchOptions).extend(searchOptions);

  request({
    uri: url,
    method: 'POST',
    form: searchOptions
  }, function(err, res, body) {
    callback(err, body);
  });
};
