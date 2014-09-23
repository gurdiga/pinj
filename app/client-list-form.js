(function() {
  'use strict';

  var SAVED_MESSAGE_TIMEOUT = 2000;

  function ClientListForm(userService, userDataService, form) {
    this.userDataService = userDataService;

    this.field = querySelector('[name="list"]', form);
    this.submitButton = querySelector('[name="submit-button"]', form);
    this.saveConfirmationMessage = querySelector('#save-confirmation-message', form);

    this.listenForAuthenticatedEventOn(userService);
    this.listenForInputOn(this.field);
    this.listenForClicksOn(this.submitButton);
  }

  MicroEvent.mixin(ClientListForm);

  ClientListForm.CLIENT_LIST_PATH = 'clients';

  ClientListForm.prototype.listenForAuthenticatedEventOn = function(userService) {
    userService.bind('authenticated', function() {
      this.loadListInto(this.field)
      .then(function() {
        this.trigger('loaded');
      }.bind(this));
    }.bind(this));

    userService.bind('deauthenticated', function() {
      this.clearList();
    }.bind(this));
  };

  ClientListForm.prototype.loadListInto = function(field) {
    return this.userDataService.get(ClientListForm.CLIENT_LIST_PATH)
    .then(function(list) {
      field.value = list;
    });
  };

  ClientListForm.prototype.clearList = function() {
    this.field.value = '';
  };

  ClientListForm.prototype.listenForInputOn = function(field) {
    field.addEventListener('input', function() {
      this.submitButton.disabled = false;
    }.bind(this));
  };

  ClientListForm.prototype.listenForClicksOn = function(submitButton) {
    submitButton.addEventListener('click', function() {
      submitButton.disabled = true;

      this.userDataService.set(ClientListForm.CLIENT_LIST_PATH, this.field.value)
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
