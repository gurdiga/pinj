(function() {
  'use strict';

  describe('Input focuser', function() {
    var FirstFieldFocuser, jQuery;
    var focuser, tabs;

    beforeEach(function() {
      FirstFieldFocuser = this.iframe.FirstFieldFocuser;
      jQuery = this.iframe.jQuery;

      tabs = jQuery(
        '<div>' +
          '<a href="#tab1">Tab1</a>' +
          '<div id="tab1">' +
            '<input name="input1"/>' +
            '<input name="input2"/>' +
          '</div>' +
        '</div>'
      );

      focuser = new FirstFieldFocuser(tabs.find('a'));
    });

    it('focuses the first input on the tab when switching tabs', function(done) {
      focuser.once('first-field-focused', done);
      tabs.find('a').trigger('shown.bs.tab');
    });
  });

}());
