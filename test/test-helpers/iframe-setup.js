(function() {
  'use strict';

  var IFRAME_ID = 'app';
  var APP_PATH = '/app.html';

  before(createIframe);

  it('testing infrastructure is all set', function() {
    expect(this.iframe).to.exist;
    expect(this.app.tagName).to.eq('BODY');
    expect(this.$).to.exist;
  });


  function createIframe(done) {
    /*jshint validthis:true*/
    this.timeout(5000);

    var iframeElement = document.createElement('iframe');

    iframeElement.id = IFRAME_ID;
    iframeElement.src = APP_PATH + '?' + Date.now();
    iframeElement.addEventListener('load', function() {
      this.iframe = iframeElement.contentWindow;
      this.app = this.iframe.document.body;
      this.$ = this.iframe.$;

      if (window.document.title.substr(-1) === ':') {
        window.document.title += ' ' + this.iframe.document.title;
      }

      this.app.bind('ready-for-tests', function() {
        done();
      });
    }.bind(this));

    document.body.appendChild(iframeElement);
    styleIframe(IFRAME_ID);
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

}());
