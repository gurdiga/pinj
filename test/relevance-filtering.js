'use strict';

describe('Relevance filtering', function() {
  [{
    section: require('app/district-courts/sections/agenda-section'),
    sampleRow: [null, '03-09-2015', '10:30', null, '02-2a-8340-29042015', 'Romanescu Constantin vs Ministerul Justitiei', null, 'Sala nr.1 bd.Stefan cel Mare 73', null, null, null],
    columnIndex: 1,
    expectedDate: new Date('2015-09-03')
  }, {
    section: require('app/district-courts/sections/sentence-section'),
    sampleRow: ['<a href="get_decision_doc.php?..." target="_blank">PDF_doc</a>', '03-07-2015', '02-21r-11133-08062015', 'Sobieski-camerzan Gheorghe', null, null, null, null],
    columnIndex: 1,
    expectedDate: new Date('2015-07-03')
  }, {
    section: require('app/district-courts/sections/summons-section'),
    sampleRow: [null, '2-1674/2014; 38-2-3714-01102014', '2015-06-03', '08.20', 'Postu Tudor Gheorghe,  dom. r.Orhei, s.Bieşti', 'Încasarea sumei', 'ÎCS”Red Union Fenosa”SA', 'Judecătoria Orhei', null, null, null, null, null],
    columnIndex: 2,
    expectedDate: new Date('2015-06-03')
  }, {
    section: require('app/supreme-court/sections/case-inquiry-section'),
    sampleRow: [null, '4028', '2015-06-25', '2r-573/15', 'Repartizat', 'Civil', 'Iordan Vitalie vs Tanga Vasilii,  ÎMOM Moldcredit SRL, intervenient accesoriu executorii judecătorești Gușan Nicolae, Albot Radu', 'executorul judecătoresc Gușan Nicolae', 'recunoașterea valabilității actului juridic  ', 'Examinarea recursului în secţiunea I', '28182'],
    columnIndex: 2,
    expectedDate: new Date('2015-06-25')
  }].forEach(function(item) {
    testDateExtraction(
      item.section,
      item.sampleRow,
      item.columnIndex,
      item.expectedDate
    );
  });

  [{
    section: require('app/district-courts/sections/case-inquiry-section'),
    sampleRow: [null, '51-4-3403-08112010', 'Romanescu Constantin Cosmin', 'Contravenţie administrativă', 'Alte contraventii', 'Incheiat', 'Ungheni', null, null],
    columnIndex: 1,
    expectedDate: new Date('2010-11-08')
  }].forEach(function(item) {
    testDateExtractionFromFileNumber(
        item.section,
        item.sampleRow,
        item.columnIndex,
        item.expectedDate
    );
  });

  function testDateExtraction(section, row, columnIndex, expectedDate) {
    describe(section.toString(), function() {
      it('has a getRowDate(row) method', function() {
        expect(section.getRowDate, 'AgendaSection.getRowDate').to.be.a('function');
      });

      it('getRowDate(row) returns the appropriate date when present', function() {
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(expectedDate.getDate());
        expect(rowDate.getMonth()).to.equal(expectedDate.getMonth());
        expect(rowDate.getFullYear()).to.equal(expectedDate.getFullYear());
      });

      it('getRowDate() returns current date when not present', function() {
        row[columnIndex] = undefined;
        var today = new Date();
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(today.getDate());
        expect(rowDate.getMonth()).to.equal(today.getMonth());
        expect(rowDate.getFullYear()).to.equal(today.getFullYear());
      });

      it('getRowDate() returns current date when date is likely invalid', function() {
        row[columnIndex] = '23-23-2015';
        var today = new Date();
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate()).to.equal(today.getDate());
        expect(rowDate.getMonth()).to.equal(today.getMonth());
        expect(rowDate.getFullYear()).to.equal(today.getFullYear());
      });
    });
  }

  function testDateExtractionFromFileNumber(section, row, columnIndex, expectedDate) {
    describe(section.toString(), function() {
      it('has a getRowDate(row) method', function() {
        expect(section.getRowDate, 'CaseInquirySection.getRowDate').to.be.a('function');
      });

      it('extracts the date from file number', function() {
        var rowDate = section.getRowDate(row);
        expect(rowDate.getDate(), 'day of month').to.equal(expectedDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(expectedDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(expectedDate.getFullYear());
      });

      it('returns current date when there is no file number', function() {
        row[columnIndex] = '';
        var rowDate = section.getRowDate(row);
        var currentDate = new Date();
        expect(rowDate.getDate(), 'day of month').to.equal(currentDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(currentDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(currentDate.getFullYear());
      });

      it('returns current date when file number is null', function() {
        row[columnIndex] = null;
        var rowDate = section.getRowDate(row);
        var currentDate = new Date();
        expect(rowDate.getDate(), 'day of month').to.equal(currentDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(currentDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(currentDate.getFullYear());
      });

      it('returns current date when can’t extract date from file number', function() {
        row[columnIndex] = 'some-garbage-1234';
        var rowDate = section.getRowDate(row);
        var currentDate = new Date();
        expect(rowDate.getDate(), 'day of month').to.equal(currentDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(currentDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(currentDate.getFullYear());
      });

      it('returns current date when the extracted date is invalid', function() {
        row[columnIndex] = 'some-garbage-12345678';
        var rowDate = section.getRowDate(row);
        var currentDate = new Date();
        expect(rowDate.getDate(), 'day of month').to.equal(currentDate.getDate());
        expect(rowDate.getMonth(), 'month').to.equal(currentDate.getMonth());
        expect(rowDate.getFullYear(), 'year').to.equal(currentDate.getFullYear());
      });
    });
  }

  describe('supreme court', function() {
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
