'use strict';

module.exports = time;

function time(description, promise) {
  description = description.toString();
  console.time(description);

  return promise
  .then(function(response) {
    console.timeEnd(description);
    return response;
  });
}
