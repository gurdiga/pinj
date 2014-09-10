(function() {
  'use strict';

  function AuthenticationForm(form) {
    MicroEvent.mixin(form);
    this.form = form;
    this.initValidation();
    this.setSubmitHandler();
    this.setAuthenticationErrorHandler();
    this.setLogoutHandler();
  }

  AuthenticationForm.prototype.initValidation = function() {
    $(this.form).bootstrapValidator({
      live: 'submitted',
      feedbackIcons: {
        valid: 'glyphicon glyphicon-ok',
        invalid: 'glyphicon glyphicon-remove',
        validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
        'authentication-email': {
          validators: {
            notEmpty: {
              message: 'Introduceţi adresa de email'
            },
            emailAddress: {
              message: 'Adresa este incorectă sintactic'
            }
          }
        },
        'authentication-password': {
          validators: {
            notEmpty: {
              message: 'Introduceţi parola'
            }
          }
        }
      }
    });
  };

  AuthenticationForm.prototype.setSubmitHandler = function() {
    var form = this.form;

    $(form).on('success.form.bv', function(event) {
      event.preventDefault();

      var email = form['authentication-email'].value;
      var password = form['authentication-password'].value;

      App.userService.authenticateUser(email, password)
      .catch(function(reason) {
        var ERROR_MESSAGES = {
          'INVALID_USER': 'Adresa de email este incorectă',
          'INVALID_PASSWORD': 'Parola este incorectă',
          'fallback': 'A intervenit o eroare neprevăzută (%CODE%).'
        };
        var errorMessage = ERROR_MESSAGES[reason.code];

        errorMessage = errorMessage || ERROR_MESSAGES['fallback'].replace('%CODE%', reason.code);
        form.trigger('authentication-failed', errorMessage);
      });
    });
  };

  AuthenticationForm.prototype.setAuthenticationErrorHandler = function() {
    var form = this.form;

    App.controller('AuthenticationFormController', function($scope, $element, $timeout) {
      form.bind('authentication-failed', function(errorMessage) {
        $scope.authenticationErrorrMessage = errorMessage;
        $scope.$digest();
        $timeout(function() {
          form.trigger('authentication-error-message-displayed');
        });
      });
    });
  };

  AuthenticationForm.prototype.setLogoutHandler = function() {
    var form = this.form;

    App.userService.bind('deauthenticated', function() {
      jQuery(form).data('bootstrapValidator').resetForm(true);
      form['authentication-email'].focus();
    });
  };

  window.AuthenticationForm = AuthenticationForm;

}());
