'use strict';

describe('SearchHistory', function() {
  var aid = 'test@test:com';

  beforeEach(function() {
    this.sinon.stub(Data, 'getLastChildOf');
    this.sinon.stub(console, 'timeEnd');
  });

  describe('getPreviousResults', function() {
    describe('when search results are found', function() {
      beforeEach(function() {
        Data.getLastChildOf.withArgs('/search-history/' + aid)
        .resolves({
          'key': '2015-20-03 13:03:12',
          'value': [ 'list of results' ]
        });
      });

      it('returns the last item in the given user’s search history', function() {
        return SearchHistory.getPreviousResults(aid)
        .then(function(result) {
          expect(result).to.deep.equal(['list of results']);
        });
      });
    });

    describe('when there are no searh results', function() {
      beforeEach(function() {
        Data.getLastChildOf.withArgs('/search-history/' + aid).resolves({});
      });

      it('returns an empty list', function() {
        return SearchHistory.getPreviousResults(aid)
        .then(function(result) {
          expect(result).to.deep.equal([]);
        });
      });
    });
  });
});

var Data = require('app/util/data');
var SearchHistory = proxyquire('app/search-history', {
  'Data': Data
});
