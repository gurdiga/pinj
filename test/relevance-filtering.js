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
  }, {
    section: require('app/supreme-court/sections/civilian-college-agenda-section'),
    sampleRow: [null, '2ra-1223/14', 'Edu Larisa vs Edu Mihail', 'CA Chişinău', '2014-05-28', '09.00', 'În lipsa părţilor', ' Completul nr.3', 'Recurs secţiunea II', 'Admise recursurile, casată integral decizia CA, remisă pricina spre rejudecare la CA Chişinău', null, '16667'],
    columnIndex: 4,
    expectedDate: new Date('2014-05-28')
  }, {
    section: require('app/supreme-court/sections/civilian-college-sentence-section'),
    sampleRow: [null, '2ra-1223/14', '2014-05-28', 'Edu Larisa vs Edu Mihail', 'Partajarea proprietăţii comune în devălmăşie şi evacuare', 'Depunerea cererii de apel. Cuprinsul cererii de apel. Cazurile in care nu se da curs cererii de apel. Restituirea cererii de apel. Cuantumurile tarifare ale taxei de stat', 'Recurs în secţiunea II', '10325'],
    columnIndex: 2,
    expectedDate: new Date('2014-05-28')
  }, {
    section: require('app/supreme-court/sections/criminal-college-agenda-section'),
    sampleRow: [null, '1ra-422/2015', '2015-06-09', 'avocatul în numele inculpaţilor', 'Rotov Grigorii, Labliuc Evgheni, Rodin Veaceslav, Costocichin Oleg', 'CA Chişinău', 'art.362/1 alin.2 CP', '10.00', 'Fără participarea părţilor', ' Completul nr.1', 'Recurs împotriva hotărârii instanţei de apel', 'Amînată pronunţarea deciziei integrale pentru 16.07.2015.', '2015-07-02 16:26:08', '7884'],
    columnIndex: 2,
    expectedDate: new Date('2015-06-09')
  }, {
    section: require('app/supreme-court/sections/criminal-college-sentence-section'),
    sampleRow: [null, '1ra-483/2013', '2013-07-19', 'Naumov V., Ciorba D., Mancevschi O., Safron D., Pozdîrca A., Crotov V.', 'art. 187 al.2, 188 al.2, 208 CP', 'art. 187 al.2, 188 al.2, 208 CP', 'Recurs împotriva hotărârii instanţei de apel', '470'],
    columnIndex: 2,
    expectedDate: new Date('2013-07-19')
  }, {
    section: require('app/supreme-court/sections/criminal-plenum-agenda-section'),
    sampleRow: [null, '4-1re-59/2015', '2015-04-02', 'avocatul Guţu V. în numele condamnatei Zaharia N.', 'Zaharia Natalia', 'CSJ', 'art.190 alin. 5 CP', '10.00', 'Fără participarea părţilor', 'Admisibilitatea recursului în anulare', 'inadmisibilitatea recursului în anulare declarat, ca fiind vădit neîntemeiat, publicat la 09.04.2015', null, '985'],
    columnIndex: 2,
    expectedDate: new Date('2015-04-02')
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
});
