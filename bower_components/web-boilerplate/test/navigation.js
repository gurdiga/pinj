(function() {
  'use strict';

  describe('navigation', function() {
    beforeEach(function(done) {
      this.navigateTo('/test/fixtures/navigation/page2.html')
      .then(done, done);
    });

    it('works', function() {
      expect(this.app, 'the reference to page’s body').to.exist;
      expect(this.iframe.document.title).to.equal('Page 2');
    });
  });

}());
