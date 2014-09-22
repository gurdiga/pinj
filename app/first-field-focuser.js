(function() {
  'use strict';

  function FirstFieldFocuser(tabLabels) {
    this.listenForTabSwitchOn(tabLabels);
  }

  FirstFieldFocuser.DELAY = 300;

  FirstFieldFocuser.prototype.listenForTabSwitchOn = function(tabLabels) {
    tabLabels.on('shown.bs.tab', function(event) {
      var context = tabLabels[0].ownerDocument.body;
      var tabContent = jQuery(event.target.getAttribute('href'), context);
      this.focusTheFirstField(tabContent);
    }.bind(this));
  };

  FirstFieldFocuser.prototype.focusTheFirstField = function(tabContent) {
    setTimeout(function() {
      tabContent.find('input:first').focus();
    }, FirstFieldFocuser.DELAY);
  };

  window.FirstFieldFocuser = FirstFieldFocuser;

}());
