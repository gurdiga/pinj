(function() {
  'use strict';

  function RegistrationForm(form) {
    this.form = form;

    MicroEvent.mixin(form);
    this.initValidation();
    this.setSubmitHandler();
    this.setRegistrationErrorHandler();
    this.setLogoutHandler();
  }

  RegistrationForm.prototype.initValidation = function() {
    $(this.form).bootstrapValidator({
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

    $(form).on('success.form.bv', function(event) {
      event.preventDefault();

      var email = form['registration-email'].value;
      var password = form['registration-password'].value;

      App.userService.registerUser(email, password)
      .then(function() {
        return App.userService.authenticateUser(email, password);
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
    App.controller('RegistrationFormController', function($scope, $element, $timeout) {
      var form = $element[0];

      form.bind('registration-failed', function(errorMessage) {
        $scope.registrationErrorrMessage = errorMessage;
        $scope.$digest();
        $timeout(function() {
          form.trigger('registration-error-message-displayed');
        });
      });
    });
  };

  RegistrationForm.prototype.setLogoutHandler = function() {
    var form = this.form;

    App.userService.bind('deauthenticated', function() {
      jQuery(form).data('bootstrapValidator').resetForm(true);
    });
  };

  window.RegistrationForm = RegistrationForm;

}());
