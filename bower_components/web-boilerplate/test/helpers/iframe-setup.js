(function() {
  'use strict';

  var IFRAME_ID = 'app';

  before(function(done) {
    injectIframe(this, done);
  });

  it('testing infrastructure is all set', function() {
    expect(this.iframe, 'iframe').to.exist;
    expect(this.app.tagName).to.eq('BODY');
  });

  function injectIframe(self, done) {
    var iframeElement = self.iframeElement = document.createElement('iframe');

    iframeElement.id = IFRAME_ID;
    iframeElement.src = APP_PATH;
    document.body.appendChild(iframeElement);
    styleIframe(IFRAME_ID);

    iframeElement.addEventListener('load', function() {
      self.iframe = iframeElement.contentWindow;
      self.app = self.iframe.document.body;
      self.waitForClientToBeReady().then(done, done);
      updateTheTitle(self);
    });
  }

  function styleIframe(id) {
    var css = document.createElement('style');

    css.innerText = '' +
      'iframe#' + id + ' {' +
      '  position: fixed;' +
      '  top: 60px;' +
      '  right: 85px;' +
      '  width: 400px;' +
      '  height: 85%;' +
      '  border: 5px solid #eee;' +
      '  background: white;' +
      '  opacity: .3;' +
      '  transition: opacity 0.5s ease;' +
      '}' +
      'iframe#' + id + ':hover {' +
      '  opacity: 1;' +
      '}';

    document.body.appendChild(css);
  }

  function updateTheTitle(self) {
    if (document.title.substr(-1) === ':') {
      document.title += ' ' + self.iframe.document.title;
    }
  }

}());
