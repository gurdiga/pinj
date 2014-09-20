(function() {
  'use strict';

  function InputFocuser(tabLabels) {
    this.listenForTabSwitchOn(tabLabels);
  }

  InputFocuser.DELAY = 300;

  InputFocuser.prototype.listenForTabSwitchOn = function(tabLabels) {
    tabLabels.on('shown.bs.tab', function(event) {
      var context = tabLabels[0].ownerDocument.body;
      var tabContent = jQuery(event.target.getAttribute('href'), context);
      this.focusTheFirstField(tabContent);
    }.bind(this));
  };

  InputFocuser.prototype.focusTheFirstField = function(tabContent) {
    setTimeout(function() {
      tabContent.find('input:first').focus();
    }, InputFocuser.DELAY);
  };

  window.InputFocuser = InputFocuser;

}());
