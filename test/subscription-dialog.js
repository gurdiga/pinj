(function() {
  'use strict';

  describe('SubscriptionDialog', function() {
    var SubscriptionDialog, DOM, Deferred, App, jQuery, UserData;
    var linkToOpen, dialogDOMElement, currentSubscription, submitButton;

    before(function() {
      SubscriptionDialog = this.iframe.SubscriptionDialog;
      DOM = this.iframe.DOM;
      Deferred = this.iframe.Deferred;
      App = this.iframe.App;
      jQuery = this.iframe.jQuery;
      UserData = this.iframe.UserData;

      linkToOpen = DOM.querySelector('#subscription-button', this.app);
      dialogDOMElement = DOM.querySelector('#subscription-dialog', this.app);
      submitButton = DOM.querySelector('button.btn-primary', dialogDOMElement);
      currentSubscription = 'c30';

      this.sinon.stub(App.userDataService, 'get')
        .withArgs(UserData.SUBSCRIPTION_PATH)
        .returns(Deferred.createResolvedPromise(currentSubscription));
      this.sinon.stub(App.userDataService, 'set')
        .returns(Deferred.createResolvedPromise());
    });

    it('is opened by the subscription linkToOpen in the menu', function(done) {
      expect(dialogDOMElement).not.to.be.visible();

      clickTheLink(linkToOpen)
      .then(function() {
        expect(dialogDOMElement).to.be.visible();
      })
      .then(closeTheDialog)
      .then(done)
      .catch(done);
    });

    it('has the list of available subscriptions, with the current one checked', function(done) {
      clickTheLink(linkToOpen)
      .then(function() {
        var radioBox = DOM.querySelector('input[type="radio"][value="' + currentSubscription + '"]', dialogDOMElement);
        expect(radioBox.checked).to.be.true;
      })
      .then(closeTheDialog)
      .then(done)
      .catch(done);
    });

    it('has a close button', function() {
      var closeButton = DOM.querySelector('button.close', dialogDOMElement);
      expect(closeButton).to.exist;
    });

    it('saves the new subscription value when clicking the submit button', function(done) {
      clickTheLink(linkToOpen)
      .then(function() {
        var newSubscription = 'c60';
        var radioBox = DOM.querySelector('input[type="radio"][value="' + newSubscription + '"]', dialogDOMElement);
        radioBox.checked = true;

        dialogDOMElement.once('saved-subscription', function() {
          expect(App.userDataService.set).to.have.been.calledWith(UserData.SUBSCRIPTION_PATH, newSubscription);
          expect(dialogDOMElement).not.to.be.visible();
          done();
        });

        submitButton.click();
      })
      .catch(done);
    });

    function clickTheLink(linkToOpen) {
      linkToOpen.click();
      return new Deferred(SubscriptionDialog.SHOW_DELAY).promise;
    }

    function closeTheDialog() {
      var deferred = new Deferred();
      var closeButton = DOM.querySelector('button.close', dialogDOMElement);

      jQuery(dialogDOMElement).on('hidden.bs.modal', function() {
        deferred.resolve();
      });

      closeButton.click();

      return deferred.promise;
    }
  });

}());
