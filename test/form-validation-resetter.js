(function() {
  'use strict';

  describe('FormValidationResetter', function() {
    this.timeout(3000);

    var FormValidationResetter, DOM, jQuery, Deferred;
    var formValidationResetter, form, tabLabels, emailField, authenticationError;

    beforeEach(function() {
      FormValidationResetter = this.iframe.FormValidationResetter;
      DOM = this.iframe.DOM;
      jQuery = this.iframe.jQuery;
      Deferred = this.iframe.Deferred;

      form = DOM.querySelector('#authentication-form', this.app);
      tabLabels = DOM.querySelector('a[data-toggle="tab"]', this.app);
      expect(tabLabels).not.to.be.empty;

      emailField = form['authentication-email'];
      this.type('blahblah').into(emailField);
      authenticationError = DOM.querySelector('#authentication-error', this.app);
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
      var tabLabel = DOM.querySelector('a[data-toggle="tab"][href="#' + tabId + '"]');
      tabLabel.click();

      return new Deferred(200).promise;
    }

    function triggerValidation() {
      var submitButton = DOM.querySelector('button[type="submit"]', form);
      submitButton.click();

      return new Deferred(200).promise;
    }

    function activateTheSecondTab() {
      var formTabId = jQuery(form).parent('.tab-pane').attr('id');
      var allTabLabels = DOM.querySelectorAll('a[data-toggle="tab"]');
      var oneOtherTabLabel = jQuery(allTabLabels).not('[href="#' + formTabId + '"]').first();
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
