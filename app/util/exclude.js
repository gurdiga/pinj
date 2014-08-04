'use strict';

// Use like this:
//
// var a = [1, 2, 3, 4, 5];
//
// a.filter(exclude([2, 3]));
//  => [1, 4, 5]
//
function exclude(itemsToExclude) {
  return function iterator(item) {
    return itemsToExclude.indexOf(item) === -1;
  };
}

module.exports = exclude;
