(function() {
  'use strict';

  function FormValidationResetter(tabLabels) {
    this.listenForTabSwitchOn(tabLabels);
  }

  FormValidationResetter.prototype.listenForTabSwitchOn = function(tabLabels) {
    tabLabels.on('shown.bs.tab', function(event) {
      this.resetFormOnTab(event.target);
    }.bind(this));
  };

  FormValidationResetter.prototype.resetFormOnTab = function(tabLabel) {
    var tabPane = DOM.querySelector(tabLabel.getAttribute('href'));
    var form = DOM.querySelector('form', tabPane);
    var errorMessage = DOM.querySelector('[id$="-error"]', form);
    var alsoResetFormData = true;

    jQuery(form).data('bootstrapValidator').resetForm(alsoResetFormData);
    errorMessage.style.display = 'none';
  };

  window.FormValidationResetter = FormValidationResetter;

}());
