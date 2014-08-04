'use strict';

var AgendaSection = require('./district-courts/sections/agenda-section');
var CaseInquirySection = require('./district-courts/sections/case-inquiry-section');
var SummonsSection = require('./district-courts/sections/summons-section');
var SentenceSection = require('./district-courts/sections/sentence-section');

var Inquirer = {};

var sections = [
  AgendaSection,
  CaseInquirySection,
  SummonsSection,
  SentenceSection
];

Inquirer.inquireAbout = function(clientNames) {
  return forEach(clientNames).inSeries(function(clientName) {
      return forEach(sections).inParallel(function(section) {
        return section.inquireAbout(clientName);
      });
    });
};

var forEach = require('./util/for-each');

module.exports = Inquirer;
