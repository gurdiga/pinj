'use strict';

var chai = require('chai');

global.expect = chai.expect;
global.proxyquire = require('proxyquire');

chai.use(require('chai-as-promised'));
chai.use(require('sinon-chai'));

require('mocha-sinon');
require('sinon-as-promised')(require('app/util/promise'));
