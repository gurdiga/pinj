'use strict';

var AgendaSection = require('./sections/agenda-section');
var CaseInquirySection = require('./sections/case-inquiry-section');
var SummonsSection = require('./sections/summons-section');
var SentenceSection = require('./sections/sentence-section');

function Inquirer() {
}

Inquirer.sections = [
  new AgendaSection(),
  new CaseInquirySection(),
  new SummonsSection(),
  new SentenceSection()
];

Inquirer.prototype.getSections = function() {
  return Inquirer.sections;
};

Inquirer.prototype.inquireAbout = function(clientNames) {
  var forEach = require('./utils/for-each');

  return forEach(clientNames).inSeries(function(clientName) {
    return forEach(this.getSections()).inParallel(function(section) {
      return section.inquireAbout(clientName);
    });
  }, this);
};

module.exports = Inquirer;
