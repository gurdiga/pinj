'use strict';

describe('isSearchResultRecentEnough', function() {
  describe('when result’s date is not older than 3 months', function() {
    var row = ['',
      getMonthsAgoAsString(2),
      '13:00',
      'Civil',
      '36-2p/o-1095-15122010',
      'SA -Moldtelecom- Chisinau vs Danu Mihail Maxim',
      'De examinare a cauzei',
      'Biroul nr. 15, Jud. Cristian Diana',
      'Acţiunea admisă, ',
      '2015-07-24 07:08:56'
    ];

    it('returns true', function() {
      expect(isSearchResultRecentEnough(section, row)).to.be.true;
    });
  });

  describe('when result’s date is older than 3 months', function() {
    var row = ['',
      getMonthsAgoAsString(5),
      '13:00',
      'Civil',
      '36-2p/o-1095-15122010',
      'SA -Moldtelecom- Chisinau vs Danu Mihail Maxim',
      'De examinare a cauzei',
      'Biroul nr. 15, Jud. Cristian Diana',
      'Acţiunea admisă, ',
      '2015-07-24 07:08:56'
    ];

    it('returns false', function() {
      expect(isSearchResultRecentEnough(section, row)).to.be.false;
    });
  });

  function getMonthsAgoAsString(numberOfMonths) {
    var date = new Date(new Date() - numberOfMonths * 31 * 24 * 3600 * 1000);
    var month = date.getMonth() + 1;
    var dayOfMonth = date.getDate();

    return date.getFullYear() + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (dayOfMonth < 10 ? '0' + '' : '') + dayOfMonth;
  }
});

var isSearchResultRecentEnough = require('app/is-search-result-recent-enough');
var section = require('app/district-courts/sections/agenda-section');
