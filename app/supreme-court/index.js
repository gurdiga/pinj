'use strict';

var CriminalPlenumAgendaSection = require('./sections/criminal-plenum-agenda-section');
var CriminalCollegeAgendaSection = require('./sections/criminal-college-agenda-section');
var CivilianCollegeAgendaSection = require('./sections/civilian-college-agenda-section');
var CriminalPlenumSentenceSection = require('./sections/criminal-plenum-sentence-section');
var CivilianCollegeSentenceSection = require('./sections/civilian-college-sentence-section');
var CriminalCollegeSentenceSection = require('./sections/criminal-college-sentence-section');

var SupremeCourt = [
  CriminalPlenumAgendaSection,
  CriminalCollegeAgendaSection,
  CivilianCollegeAgendaSection,
  CriminalPlenumSentenceSection,
  CivilianCollegeSentenceSection,
  CriminalCollegeSentenceSection
];

SupremeCourt.toString = function() {
  return 'Curtea Supremă de Justiţie';
};

module.exports = SupremeCourt;
