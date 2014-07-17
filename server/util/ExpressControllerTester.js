'use strict';

var Q = require('q');
var should = require('should');

exports.fail = function(message) {
  should.exist(null, message);
};

var ExpressControllerTester = function (_testFunc, _doneFunc) {
  this.testFunc = _testFunc;
  this.doneFunc = _doneFunc;

  this.req = {
    params: {}
  };

  this.res = {
  };

  this.deferredResult = Q.defer();
};

ExpressControllerTester.prototype.params = function(params) {
  this.req.params = params;
  return this;
};

ExpressControllerTester.prototype.response = function(expectedFunc) {
  this.res[expectedFunc] = function(status, body) {
    this.deferredResult.resolve({
      status: status,
      body: body
    });
  }.bind(this);
  return this;
};

/**
 * Provide a validator to verify the request.
 * The validator accepts 2 params: status code and body (which can be an error)
 * @param validator
 */
ExpressControllerTester.prototype.expect = function(validator) {
  this.testFunc(this.req, this.res);
  this.deferredResult.promise.then(function(result) {
    try {
      validator(result.status, result.body);
    } catch(err) {
      this.doneFunc(err);
      return;
    }
    this.doneFunc();
  }.bind(this));
};

exports.request = function(testfunc, doneFunc) {
  return new ExpressControllerTester(testfunc, doneFunc);
};