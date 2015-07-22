'use strict';

function dateFromDateString(dateString) {
  var currentDate = new Date();

  if (!dateString) return currentDate;

  var dateParts = getDateParts(dateString);
  var date = new Date(dateParts.year + '-' + dateParts.month + '-' + dateParts.dayOfMonth);

  if (date.toString() === 'Invalid Date') return currentDate;

  return date;
}

function getDateParts(dateString) {
  var dateParts = dateString.split('-');

  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return {
    year: dateParts[0],
    month: dateParts[1],
    dayOfMonth: dateParts[2]
  }; else if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) return {
    year: dateParts[2],
    month: dateParts[1],
    dayOfMonth: dateParts[0]
  }; else return {
    year: undefined,
    month: undefined,
    dayOfMonth: undefined
  };
}

module.exports = dateFromDateString;
