(function() {
  'use strict';

  describe('meta redirections', function() {
    beforeEach(function(done) {
      this.navigateTo('/test/fixtures/navigation/redirecting-page.html')
      .then(done, done);
    });

    it('works', function() {
      expect(this.app, 'the reference to page’s body').to.exist;
      expect(this.iframe.document.title).to.equal('Page 1');
    });
  });

}());
