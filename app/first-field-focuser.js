(function() {
  'use strict';

  function FirstFieldFocuser(tabLabels) {
    this.listenForTabSwitchOn(tabLabels);
  }

  MicroEvent.mixin(FirstFieldFocuser);

  FirstFieldFocuser.prototype.listenForTabSwitchOn = function(tabLabels) {
    jQuery(tabLabels).on('shown.bs.tab', function(event) {
      this.focustFirstFieldOnTab(event.target);
    }.bind(this));
  };

  FirstFieldFocuser.prototype.focustFirstFieldOnTab = function(tabLabel) {
    var context = tabLabel.ownerDocument.body;
    var tabPane = DOM.querySelector(tabLabel.getAttribute('href'), context);
    var firstField = DOM.querySelector('input', tabPane);

    firstField.focus();
    this.trigger('first-field-focused');
  };

  window.FirstFieldFocuser = FirstFieldFocuser;

}());
