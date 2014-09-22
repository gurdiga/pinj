(function() {
  'use strict';

  function FormValidationResetter(tabLabels) {
    this.listenForTabSwitchOn(tabLabels);
  }

  FormValidationResetter.prototype.listenForTabSwitchOn = function(tabLabels) {
    tabLabels.on('shown.bs.tab', function(event) {
      var tab = jQuery(event.target.getAttribute('href'));
      this.resetFormOnTab(tab);
    }.bind(this));
  };

  FormValidationResetter.prototype.resetFormOnTab = function(tab) {
    var form = tab.find('form');
    var alsoResetFormData = true;
    form.data('bootstrapValidator').resetForm(alsoResetFormData);
    querySelector('[id$="-error"]', form.get(0)).style.display = 'none';
  };

  window.FormValidationResetter = FormValidationResetter;

}());
