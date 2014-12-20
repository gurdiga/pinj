'use strict';

//
// This is ridiculous: the API doesn’t escape double quotes and when the query
// contains one it just throws:
//
// Couldn't execute query.You have an error in your SQL syntax; check the
// manual that corresponds to your MySQL server version for the right syntax to
// use near 'ORDER BY data_inregistrare asc, data_inregistrare asc LIMIT 0,
// 500' at line 1
//


// Thanks to felixge/node-mysql for this function; I have stripped it to only
// hanlde strings.
module.exports = function(val) {
  val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
    switch(s) {
      case '\0': return '\\0';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '\b': return '\\b';
      case '\t': return '\\t';
      case '\x1a': return '\\Z';
      default: return '\\' + s;
    }
  });

  return val;
};
