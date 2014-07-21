'use strict';

function Lawyer(params) {
  this.email = params.email;
  this.clientNames = params.clientNames;
}

Lawyer.prototype.getClientNames = function() {
  return this.clientNames;
};

module.exports = Lawyer;
