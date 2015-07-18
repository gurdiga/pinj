'use strict';

//
// TODO:
// - get sample row sets for each section.
// - implement per-section getRowDate()
//
// Note: for records that do not have an explicit event date, try to
// extract it from the file ID.
//

var section, row;

describe('Relevance filtering', function() {
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

      it('has a getRowDate(row) method', function() {
        expect(section.getRowDate, 'AgendaSection.getRowDate').to.be.a('function');
      });

      it('getRowDate(row) returns the appropriate date when present', function() {
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(3);
        expect(rowDate.getMonth()).to.equal(8);
        expect(rowDate.getFullYear()).to.equal(2015);
      });

      it('getRowDate() returns current date when not present', function() {
        row[1] = undefined;
        var today = new Date();
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(today.getDate());
        expect(rowDate.getMonth()).to.equal(today.getMonth());
        expect(rowDate.getFullYear()).to.equal(today.getFullYear());
      });

      it('getRowDate() returns current date when date is likely invalid', function() {
        row[1] = '23-23-2015';
        var today = new Date();
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(today.getDate());
        expect(rowDate.getMonth()).to.equal(today.getMonth());
        expect(rowDate.getFullYear()).to.equal(today.getFullYear());
      });
    });

    describe('CaseInquirySection', function() {
      beforeEach(function() {
        section = require('app/district-courts/sections/case-inquiry-section');
        row = [
          null,
          '51-4-3403-08112010',
          'Romanescu Constantin Cosmin',
          'Contravenţie administrativă',
          'Alte contraventii',
          'Incheiat',
          'Ungheni',
          null,
          null
        ];
      });

      it('has a getRowDate(row) method', function() {
        expect(section.getRowDate, 'CaseInquirySection.getRowDate').to.be.a('function');
      });

      it('extracts the date from file number', function() {
        var rowDate = section.getRowDate(row); // 08112010
        expect(rowDate.getDate(), 'day of month').to.equal(8);
        expect(rowDate.getMonth(), 'month').to.equal(10);
        expect(rowDate.getFullYear(), 'year').to.equal(2010);
      });

      it('returns current date when there is no file number', function() {
        row[1] = '';
        var rowDate = section.getRowDate(row);
        var currentDate = new Date();
        expect(rowDate.getDate(), 'day of month').to.equal(currentDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(currentDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(currentDate.getFullYear());
      });

      it('returns current date when file number is null', function() {
        row[1] = null;
        var rowDate = section.getRowDate(row);
        var currentDate = new Date();
        expect(rowDate.getDate(), 'day of month').to.equal(currentDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(currentDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(currentDate.getFullYear());
      });

      it('returns current date when can’t extract date from file number', function() {
        row[1] = 'some-garbage-1234';
        var rowDate = section.getRowDate(row);
        var currentDate = new Date();
        expect(rowDate.getDate(), 'day of month').to.equal(currentDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(currentDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(currentDate.getFullYear());
      });

      it('returns current date when the extracted date is invalid', function() {
        row[1] = 'some-garbage-12345678';
        var rowDate = section.getRowDate(row);
        var currentDate = new Date();
        expect(rowDate.getDate(), 'day of month').to.equal(currentDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(currentDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(currentDate.getFullYear());
      });
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
