'use strict';

var PlenumAgendaSection = require('./sections/plenum-agenda-section');
var AppealPanelAgendaSection = require('./sections/appeal-panel-agenda-section');
var CriminalPlenumAgendaSection = require('./sections/criminal-plenum-agenda-section');
var CriminalCollegeAgendaSection = require('./sections/criminal-college-agenda-section');
var CivilianCollegeAgendaSection = require('./sections/civilian-college-agenda-section');
var PlenumSentenceSection = require('./sections/plenum-sentence-section');
var CriminalPlenumSentenceSection = require('./sections/criminal-plenum-sentence-section');
var AppealPanelSentenceSection = require('./sections/appeal-panel-sentence-section');
var CivilianCollegeSentenceSection = require('./sections/civilian-college-sentence-section');
var CriminalCollegeSentenceSection = require('./sections/criminal-college-sentence-section');
var OldSentenceSection = require('./sections/old-sentence-section');

var SupremeCourt = [
  PlenumAgendaSection,
  AppealPanelAgendaSection,
  CriminalPlenumAgendaSection,
  CriminalCollegeAgendaSection,
  CivilianCollegeAgendaSection,
  PlenumSentenceSection,
  CriminalPlenumSentenceSection,
  AppealPanelSentenceSection,
  CivilianCollegeSentenceSection,
  CriminalCollegeSentenceSection,
  OldSentenceSection
];

SupremeCourt.toString = function() {
  return 'Curtea Supremă de Justiţie';
};

module.exports = SupremeCourt;
