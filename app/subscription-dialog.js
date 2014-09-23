(function() {
  'use strict';

  function SubscriptionDialog(linkToOpen, dialogDOMElement, submitButton, userDataService) {
    this.userDataService = userDataService;
    this.dialogDOMElement = dialogDOMElement;

    MicroEvent.mixin(dialogDOMElement);

    this.listenFowShownEventOn(dialogDOMElement);
    this.listenForClicksOn(submitButton);
  }

  SubscriptionDialog.SHOW_DELAY = 250;
  SubscriptionDialog.DATA_PATH = 'subscription';

  SubscriptionDialog.prototype.listenFowShownEventOn = function(dialogDOMElement) {
    var loadCurrentSubscriptionInto = this.loadCurrentSubscriptionInto.bind(this);

    jQuery(dialogDOMElement).on('shown.bs.modal', function() {
      loadCurrentSubscriptionInto(dialogDOMElement);
    });
  };

  SubscriptionDialog.prototype.loadCurrentSubscriptionInto = function(dialogDOMElement) {
    this.userDataService.get(SubscriptionDialog.DATA_PATH)
    .then(function(data) {
      var radioBox = querySelector('input[type="radio"][value="' + data + '"]', dialogDOMElement);
      radioBox.checked = true;
    }.bind(this));
  };

  SubscriptionDialog.prototype.listenForClicksOn = function(submitButton) {
    submitButton.addEventListener('click', function() {
      this.saveSubscriptionAndClose();
    }.bind(this));
  };

  SubscriptionDialog.prototype.saveSubscriptionAndClose = function() {
    var newSubscription = querySelector('input[name="subscription"]:checked', this.dialogDOMElement);

    this.userDataService.set(SubscriptionDialog.DATA_PATH, newSubscription.value)
    .then(function() {
      return this.closeDialog();
    }.bind(this))
    .then(function() {
      this.dialogDOMElement.trigger('saved-subscription');
    }.bind(this))
    .catch(function(error) {
      console.error('Error while saving subscription:', error);
    });
  };

  SubscriptionDialog.prototype.closeDialog = function() {
    var deferred = new Deferred();

    jQuery(this.dialogDOMElement)
    .on('hidden.bs.modal', function() {
      deferred.resolve();
    })
    .modal('hide');

    return deferred.promise;
  };

  window.SubscriptionDialog = SubscriptionDialog;

}());
