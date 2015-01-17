'use strict';

module.exports = assertEnvironmentVariables;

function assertEnvironmentVariables(variables) {
  variables.forEach(function(variable) {
    if (!process.env[variable]) throw new Error(variable + ' variable is expected to exist in the environment');
  });
}
