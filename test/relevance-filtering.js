'use strict';

//
// TODO:
// - get sample row sets for each section.
// - implement per-section getRecordDate()
//
// Note: for records that do not have an explicit event date, try to
// extract it from the file ID.
//

var section, row;

describe.only('Relevance filtering', function() {
  describe('district courts', function() {
    describe('AgendaSection', function() {
      beforeEach(function() {
        section = require('app/district-courts/sections/agenda-section');
        row = [
          null,
          '03-09-2015',
          '10:30',
          null,
          '02-2a-8340-29042015',
          'Romanescu Constantin vs Ministerul Justitiei',
          null,
          'Sala nr.1 bd.Stefan cel Mare 73',
          null,
          null,
          null
        ];
      });

      it('has a getRecordDate(row) method', function() {
        expect(section.getRowDate, 'AgendaSection.getRowDate').to.be.a('function');
      });

      it('getRowDate(row) returns the appropriate date when present', function() {
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(3);
        expect(rowDate.getMonth()).to.equal(8);
        expect(rowDate.getFullYear()).to.equal(2015);
      });

      it('getRowDate(undefined) returns current date when not present', function() {
        row[1] = undefined;
        var today = new Date();
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(today.getDate());
        expect(rowDate.getMonth()).to.equal(today.getMonth());
        expect(rowDate.getFullYear()).to.equal(today.getFullYear());
      });

      it('getRowDate(undefined) returns current date when date is likely invalid', function() {
        row[1] = '23-23-2015';
        var today = new Date();
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(today.getDate());
        expect(rowDate.getMonth()).to.equal(today.getMonth());
        expect(rowDate.getFullYear()).to.equal(today.getFullYear());
      });
    });

    describe('CaseInquirySection', function() {
    });

    describe('SentenceSection', function() {
    });

    describe('SummonsSection', function() {
    });
  });

  describe('supreme court', function() {
    describe('CaseInquirySection', function() {
    });

    describe('CivilianCollegeAgendaSection', function() {
    });

    describe('CivilianCollegeSentenceSection', function() {
    });

    describe('CriminalCollegeAgendaSection', function() {
    });

    describe('CriminalCollegeSentenceSection', function() {
    });

    describe('CriminalPlenumAgendaSection', function() {
    });

    describe('CriminalPlenumAgendaSection', function() {
    });
  });
});
