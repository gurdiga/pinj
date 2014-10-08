'use strict';

function time(promise, label) {
  label = label.toString();
  console.time(label);

  return promise
  .then(function(response) {
    console.timeEnd(label);
    return response;
  });
}

module.exports = time;
