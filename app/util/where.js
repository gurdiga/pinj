'use strict';

module.exports = where;

function where(propertyName, value) {
  return function(o) {
    return o[propertyName] === value;
  };
}
