'use strict';

describe('findNews', function() {
  var searchResultSets;

  describe('when there is something new in the current results', function() {
    beforeEach(function() {
      searchResultSets = {
        'previous': fixture1,
        'current' : fixture2
      };
    });

    it('returns the new rows in the same strucutre as the results', function() {
      var expectedNews = [ {
        'label' : 'Georgescu George',
        'results' : [ {
          'label' : 'Instanţele de gradul 1 şi 2 de jurisdicţie',
          'results' : [ {
            'label' : 'Agenda şedinţelor',
            'results' : [ {
              'label' : 'jbu',
              'results' : [
                '[null,\"04-09-2014\",\"12:30\",null,\"14-25-7711-04082014\",\"Georgescu George vs Ex.Cogilnicean Victor\",null,\"bir.606., et.6\",null,null,null]',
                '[null,\"05-09-2014\",\"12:30\",null,\"14-25-7711-04082014\",\"Georgescu George vs Ex.Cogilnicean Victor\",null,\"bir.606., et.6\",null,null,null]',
              ]
            } ]
          } ]
        } ]
      } ];
      expect(findNews(searchResultSets)).to.deep.equal(expectedNews);
    });
  });

  describe('when nothing changed', function() {
    beforeEach(function() {
      searchResultSets = {
        'previous': fixture1,
        'current' : fixture1
      };
    });

    it('returns an empty array', function() {
      expect(findNews(searchResultSets)).to.deep.equal([]);
    });
  });

  describe('when currently got less results than previously', function() {
    beforeEach(function() {
      searchResultSets = {
        'previous': fixture2,
        'current' : fixture1
      };
    });

    it('returns an empty array', function() {
      expect(findNews(searchResultSets)).to.deep.equal([]);
    });
  });
});

var findNews = require('app/find-news');
var fixture1 = require('./find-news.fixture-1');
var fixture2 = require('./find-news.fixture-2');
