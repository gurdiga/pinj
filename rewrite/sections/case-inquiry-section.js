'use strict';

function CaseInquirySection() {
}

CaseInquirySection.prototype.toString = function() {
  return 'CaseInquirySection';
};

CaseInquirySection.prototype.inquireAbout = function(clientName) {
  console.log('CaseInquirySection inquireAbout', clientName);

  var forEach = require('../utils/for-each');
  var Courts = require('../courts');
  var courtIds = Courts.getIds();

  return forEach(courtIds).inParallel(function(courtId) {
    return forEach.todo('Query court ' + courtId + '’s API for ' + clientName);
  });
};

module.exports = CaseInquirySection;
