(function() {
  'use strict';

  describe('Input focuser', function() {
    var FirstFieldFocuser, jQuery;
    var focuser, tabs;

    beforeEach(function() {
      FirstFieldFocuser = this.iframe.FirstFieldFocuser;
      jQuery = this.iframe.jQuery;

      tabs = document.createElement('div');
      tabs.innerHTML =
        '<a href="#tab1">Tab1</a>' +
        '<div id="tab1">' +
          '<input name="input1"/>' +
          '<input name="input2"/>' +
        '</div>';

      document.body.appendChild(tabs);

      focuser = new FirstFieldFocuser(jQuery(tabs).find('a'));
    });

    it('focuses the first input on the tab when switching tabs', function(done) {
      focuser.once('first-field-focused', done);
      jQuery(tabs).find('a').trigger('shown.bs.tab');
    });

    afterEach(function() {
      document.body.removeChild(tabs);
    });
  });

}());
