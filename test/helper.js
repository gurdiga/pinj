'use strict';

var chai = require('chai');

global.expect = chai.expect;
global.proxyquire = require('proxyquire');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));
require('mocha-sinon');

var Q = require('q');
require('sinon-as-promised')(Q.Promise);
