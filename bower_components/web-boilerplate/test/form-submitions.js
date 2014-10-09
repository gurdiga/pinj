(function() {
  'use strict';

  describe('form submission', function() {
    beforeEach(function(done) {
      this.navigateTo('/test/fixtures/navigation/page-with-form.html')
      .then(done, done);
    });

    it('works', function(done) {
      var self = this;
      var form = self.app.querySelector('form');

      self.submit(form)
      .then(function() {
        expect(self.iframe.document.title).to.equal('Form handler');
        expect(self.iframe.location.search).to.exist;
      })
      .then(done, done);
    });
  });

}());
