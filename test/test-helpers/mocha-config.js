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

  describe.integration = function(description, tests) {
    var enclosure = location.hash.match(/skip-integration-tests/) ? describe.skip : describe;
    return enclosure(description, tests);
  };

}());
