(function() {
  'use strict';

  var SAVED_MESSAGE_TIMEOUT = 2000;

  function ClientListForm(userService, userDataService, form) {
    this.userService = userService;
    this.userDataService = userDataService;

    this.field = DOM.querySelector('[name="list"]', form);
    this.submitButton = DOM.querySelector('[name="submit-button"]', form);
    this.saveConfirmationMessage = DOM.querySelector('#save-confirmation-message', form);

    this.listenForAuthenticatedEventOnUserService();
    this.listenForInputOnField();
    this.listenForClicksOnSubmitButton();
  }

  MicroEvent.mixin(ClientListForm);

  ClientListForm.prototype.listenForAuthenticatedEventOnUserService = function() {
    this.userService.bind('authenticated', this.loadList.bind(this));
    this.userService.bind('deauthenticated', this.clearList.bind(this));
  };

  ClientListForm.prototype.loadList = function() {
    return this.userDataService.get(UserData.CLIENT_LIST_PATH)
    .then(function(list) {
      this.field.value = list;
    }.bind(this))
    .then(this.trigger.bind(this, 'loaded'));
  };

  ClientListForm.prototype.clearList = function() {
    this.field.value = '';
  };

  ClientListForm.prototype.listenForInputOnField = function() {
    this.field.addEventListener('input', function() {
      this.submitButton.disabled = false;
    }.bind(this));
  };

  ClientListForm.prototype.listenForClicksOnSubmitButton = function() {
    this.submitButton.addEventListener('click', function() {
      this.submitButton.disabled = true;

      this.userDataService.set(UserData.CLIENT_LIST_PATH, this.field.value)
      .then(function() {
        this.saveConfirmationMessage.style.display = 'inline';
        this.trigger('saved');

        setTimeout(function() {
          this.saveConfirmationMessage.style.display = 'none';
        }.bind(this), SAVED_MESSAGE_TIMEOUT);
      }.bind(this));

    }.bind(this));
  };

  window.ClientListForm = ClientListForm;

}());
