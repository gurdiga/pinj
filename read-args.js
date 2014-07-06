'use strict';

var _ = require('underscore');

module.exports = function() {
  var args = process.argv.slice(2);

  if (args.length === 0) {
    showUsageAndExit();
  }

  var căutări = args.map(function(căutare) {
    return căutare.split(':');
  });

  return _(căutări).object();
};


function showUsageAndExit() {
  console.log(
    'Usage:\n' +
    '\n' +
    '  ' + process.argv[1] + ' "text de căutat:curtea de apel" ...' +
    '\n'
  );

  process.exit(1);
}
