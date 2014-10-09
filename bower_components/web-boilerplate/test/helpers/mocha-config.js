(function() {
  'use strict';

  window.mocha.setup('bdd');
  window.mocha.reporter('html');
  window.expect = chai.expect;

  window.chai.config.includeStack = true;
  window.chai.config.showDiff = false;

  beforeEach(function() {
    this.sinon = sinon.sandbox.create();
  });

  afterEach(function(){
    this.sinon.restore();
  });

  var TYPES_OF_TESTS = ['integration'];

  TYPES_OF_TESTS.forEach(function(type) {
    describe[type] = function(description, tests) {
      var command = 'skip-' + type + '-tests';
      var enclosure = location.hash.indexOf(command) > -1 ? describe.skip : describe;
      return enclosure(description, tests);
    };
  });

}());
