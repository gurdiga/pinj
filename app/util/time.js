'use strict';

function time(f, label) {
  label = label || f.name || 'unlabeled';

  return function() {
    console.time(label);
    var returnValue = f.apply(this, arguments);
    console.timeEnd(label);

    return returnValue;
  };
}

module.exports = time;
