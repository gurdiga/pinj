'use strict';

function Emailer() {
}

Emailer.prototype.send = function(params) {
  var results = params.results;
  var address = params.address;

  // TODO: get the Jade template rendered

  console.log('Sending %s bytes to %s', JSON.stringify(results).length, address);
};

module.exports = Emailer;