(function() {
  'use strict';

  describe('FormValidationResetter', function() {
    this.timeout(3000);

    var FormValidationResetter, querySelector, jQuery, Deferred;
    var formValidationResetter, form, tabLabels, emailField, authenticationError;

    beforeEach(function() {
      FormValidationResetter = this.iframe.FormValidationResetter;
      querySelector = this.iframe.querySelector;
      jQuery = this.iframe.jQuery;
      Deferred = this.iframe.Deferred;

      form = querySelector('#authentication-form', this.app);
      tabLabels = jQuery('a[data-toggle="tab"]', this.app);
      expect(tabLabels).not.to.be.empty;

      emailField = form['authentication-email'];
      this.type('blahblah').into(emailField);
      authenticationError = querySelector('#authentication-error', this.app);
      authenticationError.style.display = 'block';

      formValidationResetter = new FormValidationResetter(tabLabels);
    });

    it('when switching tabs the validation messages are reset', function(done) {
      activateFirstTab()
      .then(triggerValidation)
      .then(function() {
        expect(validationActivated(), 'validation activated').to.be.true;
      })
      .then(activateTheSecondTab)
      .then(activateFirstTab)
      .then(function() {
        expect(validationClearedFor(), 'validation cleared').to.be.true;
        expect(emailField.value).to.be.empty;
        expect(authenticationError).not.to.be.visible();
        done();
      })
      .catch(done);
    });

    function activateFirstTab() {
      var tabId = jQuery(form).parent('.tab-pane').attr('id');
      var tabLabel = jQuery('a[data-toggle="tab"][href="#' + tabId + '"]');
      tabLabel.click();

      return new Deferred(200).promise;
    }

    function triggerValidation() {
      var submitButton = querySelector('button[type="submit"]', form);
      submitButton.click();

      return new Deferred(200).promise;
    }

    function activateTheSecondTab() {
      var formTabId = jQuery(form).parent('.tab-pane').attr('id');
      var allTabLabels = jQuery('a[data-toggle="tab"]');
      var oneOtherTabLabel = allTabLabels.not('[href="#' + formTabId + '"]').first();
      oneOtherTabLabel.click();

      return new Deferred(200).promise;
    }

    function validationActivated() {
      return jQuery(form).find('.form-group.has-error').length > 0;
    }

    function validationClearedFor() {
      return jQuery(form).find('.form-group.has-error').length === 0;
    }
  });

}());