'use strict';

function SummonsSection() {
}

SummonsSection.prototype.toString = function() {
  return 'SummonsSection';
};

SummonsSection.prototype.inquireAbout = function(clientName) {
  console.log('SummonsSection inquireAbout', clientName);

  var forEach = require('../utils/for-each');
  var Courts = require('../courts');
  var courtIds = Courts.getIds();

  return forEach(courtIds).inParallel(function(courtId) {
    return forEach.todo('Query court ' + courtId + '’s API for ' + clientName);
  });
};

module.exports = SummonsSection;
