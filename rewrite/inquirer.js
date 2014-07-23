'use strict';

var AgendaSection = require('./sections/agenda-section');
var CaseInquirySection = require('./sections/case-inquiry-section');
var SummonsSection = require('./sections/summons-section');
var SentenceSection = require('./sections/sentence-section');

var Inquirer = {};

var sections = [
  new AgendaSection(),
  new CaseInquirySection(),
  new SummonsSection(),
  new SentenceSection()
];

Inquirer.inquireAbout = function(clientNames) {
  var forEach = require('./utils/for-each');

  return forEach(clientNames).inSeries(function(clientName) {
    return forEach(sections).inParallel(function(section) {
      return section.inquireAbout(clientName);
    });
  }, this);
};

module.exports = Inquirer;
