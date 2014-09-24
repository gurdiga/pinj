(function() {
  'use strict';

  function RegistrationForm(form, userService) {
    this.userService = userService;
    this.form = form;

    MicroEvent.mixin(form);

    this.initValidation();
    this.setSubmitHandler();
    this.setRegistrationErrorHandler();
    this.setLogoutHandler();
  }

  RegistrationForm.prototype.initValidation = function() {
    jQuery(this.form).bootstrapValidator({
      live: 'submitted',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        'registration-email': {
          validators: {
            notEmpty: {
              message: 'Introduceţi adresa de email'
            },
            emailAddress: {
              message: 'Adresa este incorectă sintactic'
            }
          }
        },
        'registration-password': {
          validators: {
            notEmpty: {
              message: 'Introduceţi parola',
            },
            identical: {
              field: 'registration-password-confirmation',
              message: 'Nu corespunde cu confirmarea'
            }
          }
        },
        'registration-password-confirmation': {
          validators: {
            notEmpty: {
              message: 'Confirmaţi parola'
            },
            identical: {
              field: 'registration-password',
              message: 'Nu corespunde cu parola'
            }
          }
        }
      }
    });
  };

  RegistrationForm.prototype.setSubmitHandler = function() {
    var form = this.form;
    var userService = this.userService;

    jQuery(form).on('success.form.bv', function(event) {
      event.preventDefault();

      var email = form['registration-email'].value;
      var password = form['registration-password'].value;

      userService.registerUser(email, password)
      .then(function() {
        return userService.authenticateUser(email, password);
      })
      .catch(function(reason) {
        var ERROR_MESSAGES = {
          'EMAIL_TAKEN': 'Acest email este înregistrat deja.',
          'fallback': 'A intervenit o eroare (%CODE%).'
        };
        var errorMessage = ERROR_MESSAGES[reason.code];

        errorMessage = errorMessage || ERROR_MESSAGES['fallback'].replace('%CODE%', reason.code);
        form.trigger('registration-failed', errorMessage);
      });
    });
  };

  RegistrationForm.prototype.setRegistrationErrorHandler = function() {
    var form = this.form;

    form.bind('registration-failed', function(errorMessage) {
      var errorMessageElement = DOM.querySelector('#registration-error');

      errorMessageElement.textContent = errorMessage;
      errorMessageElement.style.display = 'block';

      form.trigger('registration-error-message-displayed');
    });
  };

  RegistrationForm.prototype.setLogoutHandler = function() {
    this.userService.bind('deauthenticated', this.resetForm.bind(this));
  };

  RegistrationForm.prototype.resetForm = function() {
    var tabId = jQuery(this.form).parent('.tab-pane').attr('id');
    var tabLabel = jQuery('a[data-toggle="tab"][href="#' + tabId + '"]');

    setTimeout(function() {
      tabLabel.trigger('shown.bs.tab');
    });
  };

  window.RegistrationForm = RegistrationForm;

}());
