(function() {
  'use strict';

  function ClientListForm(clientListService, field, submitButton, saveConfirmationMessage) {
    this.clientListService = clientListService;
    this.field = field;
    this.submitButton = submitButton;
    this.saveConfirmationMessage = saveConfirmationMessage;

    this.loadListInto(field);
    this.watchInputOnField(field);
    this.watchClicksOn(submitButton);
  }

  MicroEvent.mixin(ClientListForm);

  ClientListForm.prototype.loadListInto = function(field) {
    this.promise = this.clientListService.load()
      .then(function(list) {
        field.value = list;
      });
  };

  ClientListForm.prototype.watchInputOnField = function(field) {
    field.addEventListener('input', function() {
      this.submitButton.disabled = false;
    }.bind(this));
  };

  ClientListForm.prototype.watchClicksOn = function(submitButton) {
    submitButton.addEventListener('click', function() {
      submitButton.disabled = true;

      this.clientListService.save(this.field.value)
      .then(function() {
        submitButton.disabled = false;
        this.saveConfirmationMessage.style.display = 'inline';
        this.trigger('saved');

        setTimeout(function() {
          this.saveConfirmationMessage.style.display = 'none';
        }.bind(this), 2000);
      }.bind(this));

    }.bind(this));
  };

  window.ClientListForm = ClientListForm;

}());
