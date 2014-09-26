(function() {
  'use strict';

  function FormValidationResetter(tabLabels) {
    this.tabLabels = tabLabels;
    this.listenForTabSwitchOnTabLabels();
  }

  FormValidationResetter.prototype.listenForTabSwitchOnTabLabels = function() {
    jQuery(this.tabLabels).on('shown.bs.tab', function(event) {
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
