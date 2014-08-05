'use strict';

var AgendaSection = require('./sections/agenda-section');
var CaseInquirySection = require('./sections/case-inquiry-section');
var SummonsSection = require('./sections/summons-section');
var SentenceSection = require('./sections/sentence-section');

var DistrictCourts = [
  AgendaSection,
  CaseInquirySection,
  SummonsSection,
  SentenceSection
];

DistrictCourts.toString = function() {
  return 'Instanţele de gradul 1 şi 2 de jurisdicţie';
};

module.exports = DistrictCourts;
