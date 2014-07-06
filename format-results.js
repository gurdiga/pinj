'use strict';

var format = require('util').format;
var strings = require('./strings.json');
var _ = require('underscore');

module.exports = function(data) {
  return header(data.context) + contents(data.results);
};

function header(context) {
  var headerText = format('Căutare: "%s" la "%s"', context.query, context.curteaDeApel);
  var headerLine = '='.repeat(headerText.length);

  return headerText + '\n' + headerLine + '\n';
};

function contents(results) {
  var dbNames = Object.keys(strings);

  return _(dbNames).map(function(internalName) {
    var result = results[internalName];
    var title = strings[internalName].title;

    return formatResult(title, internalName, result);
  }).join('');
};

function formatResult(title, internalName, data) {
  var header = formatResultTitle(title);
  var contents = '';

  try {
    var parsedData = JSON.parse(data);
    contents = formatParsedResult(internalName, parsedData);
  } catch(e) {
    contents = formatUnparsableResult(e, internalName, data);
  }

  return header + contents + '\n';
}

function formatResultTitle(title) {
  var headerText = title + ':';
  var headerLine = '-'.repeat(headerText.length);

  return headerText + '\n' + headerLine + '\n';
}

function formatParsedResult(internalName, data) {
  var contents = '';
  var columnTitles = strings[internalName].columnTitles;

  if (data.rows) {
    contents = data.rows.map(function(row, i) {
      var rowIndex = (i + 1) + '.';
      var columns = columnTitles.map(function(columnTitle, i) {
        if (columnTitle === 'SKIP') return '';

        return '  ' + columnTitle + ': ' + row.cell[i] + '\n';
      }).join('');

      return rowIndex + '\n' + columns;
    }).join('');
  } else {
    contents = 'Nu sunt date.\n';
  }

  return contents;
}

function formatUnparsableResult(err, internalName, data) {
  console.error('Could not JSON.parse result from %s: %s', internalName, err);
  console.error(err.stack);
  console.error('Response text from PINJ:\n', data);

  return 'Eroare: Nu am putut citi datele de la PINJ.\n';
}

String.prototype.repeat = function(num) {
  return new Array( num + 1 ).join( this );
};
