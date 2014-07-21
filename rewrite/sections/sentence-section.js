'use strict';

function SentenceSection() {
}

SentenceSection.prototype.toString = function() {
  return 'SentenceSection';
};

SentenceSection.prototype.inquireAbout = function(clientName) {
  console.log('SentenceSection inquireAbout', clientName);

  var forEach = require('../utils/for-each');
  var Courts = require('../courts');
  var courtIds = Courts.getIds();

  return forEach(courtIds).inParallel(function(courtId) {
    return forEach.todo('Query court ' + courtId + '’s API for ' + clientName);
  });
};

module.exports = SentenceSection;
