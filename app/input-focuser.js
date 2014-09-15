(function() {
  'use strict';

  function InputFocuser(tabLabels) {
    tabLabels.on('shown.bs.tab', function(e) {
      var context = tabLabels[0].ownerDocument.body;
      var tabContent = jQuery(e.target.getAttribute('href'), context);

      setTimeout(function() {
        tabContent.find('input:first').focus();
      }, InputFocuser.DELAY);
    });
  }

  InputFocuser.DELAY = 500;

  window.InputFocuser = InputFocuser;

}());
