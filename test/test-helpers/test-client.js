(function() {
  'use strict';

  TestClient.DELAY = 500;

  function TestClient(testRunner) {
    this.testRunner = testRunner;

    this.run();
  }

  MicroEvent.mixin(TestClient);

  TestClient.prototype.run = function() {
    if (!this.testRunner) return;

    if (this.testRunner.reloadedWithoutTheCache) this.announceReadiness();
    else this.reloadWithoutTheCache();
  };

  TestClient.prototype.reloadWithoutTheCache = function() {
    this.testRunner.reloadedWithoutTheCache = true;
    window.location.reload(true);
  };

  TestClient.prototype.announceReadiness = function() {
    setTimeout(function() {
      this.trigger('ready');
    }.bind(this), TestClient.DELAY);
  };

  window.TestClient = TestClient;

}());
