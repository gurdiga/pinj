'use strict';

var chai = require('chai');

global.expect = chai.expect;

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('mocha-sinon');
