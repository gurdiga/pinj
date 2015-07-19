'use strict';

function dateFromFileNumber(fileNumber) {
  var currentDate = new Date();

  if (!fileNumber) return currentDate;

  var dateMatch = fileNumber.match(/\d{8}$/);

  if (!dateMatch) return currentDate;

  var dateString = dateMatch[0];

  if (!dateString) return currentDate;

  var dayOfMonth = dateString.substr(0, 2);
  var month = dateString.substr(2, 2);
  var year = dateString.substr(4, 4);

  var date = new Date(year + '-' + month + '-' + dayOfMonth);

  if (date.toString() === 'Invalid Date') return currentDate;

  return date;
}

module.exports = dateFromFileNumber;
