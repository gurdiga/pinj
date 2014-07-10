'use strict';

var _ = require('underscore');

module.exports = function() {
  var args = process.argv.slice(2);

  if (args.length === 0) {
    showUsageAndExit();
    process.exit(1);
    return;
  }

  var searches = args.map(function(pair) {
    return pair.split(':');
  });

  return convertToHash(searches);
};


function convertToHash(arrayOfArrays) {
  return _(arrayOfArrays).object();
}

function showUsageAndExit() {
  console.log(
    'Usage:\n' +
    '\n' +
    '  ' + process.argv[1] + ' "text de căutat:curtea de apel" ...' +
    '\n'
  );
}
