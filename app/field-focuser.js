(function() {
  'use strict';

  function FieldFocuser(tabLabels) {
    this.listenForTabSwitchOn(tabLabels);
  }

  FieldFocuser.DELAY = 300;

  FieldFocuser.prototype.listenForTabSwitchOn = function(tabLabels) {
    tabLabels.on('shown.bs.tab', function(event) {
      var context = tabLabels[0].ownerDocument.body;
      var tabContent = jQuery(event.target.getAttribute('href'), context);
      this.focusTheFirstField(tabContent);
    }.bind(this));
  };

  FieldFocuser.prototype.focusTheFirstField = function(tabContent) {
    setTimeout(function() {
      tabContent.find('input:first').focus();
    }, FieldFocuser.DELAY);
  };

  window.FieldFocuser = FieldFocuser;

}());
