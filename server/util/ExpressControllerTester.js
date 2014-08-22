'use strict';

var Q = require('q');
var should = require('should');
var self;

exports.fail = function(message) {
  should.exist(null, message);
};

function assertValidCall(name) {
  if(self.expectedFuncs.indexOf(name) < 0) {
    self.deferredResult.reject(new Error('The called function \'' + name + '\' was not expected. One of \'[' + self.expectedFuncs + ']\' was expected.'));
  }
}

function status(status) {
  self.status = status;
  return self.res;
}

function json(body) {
  assertValidCall('json');
  self.deferredResult.resolve({
    status: self.status,
    body: body
  });
}

function send(body) {
  assertValidCall('send');
  self.deferredResult.resolve({
    status: self.status,
    body: body
  });
}

function sendFile(body, cb) {
  assertValidCall('sendFile');
  self.deferredResult.resolve({
    status: self.status,
    cb: cb,
    body: body
  });
}

var ExpressControllerTester = function (_testFunc, _doneFunc) {
  self = this;

  this.testFunc = _testFunc;
  this.doneFunc = _doneFunc;
  this.expectedFuncs = [];
  this.status = -1;

  this.req = {
    params: {},
    user: {},
    body: {}
  };

  this.res = {
    'status': status,
    'json': json,
    'send': send,
    'sendFile': sendFile
  };

  this.deferredResult = Q.defer();
};

ExpressControllerTester.prototype.asUser = function(user) {
  this.req.user = user;
  return this;
};

ExpressControllerTester.prototype.withParams = function(params) {
  this.req.params = params;
  return this;
};

ExpressControllerTester.prototype.withBody = function(body) {
  this.req.body = body;
  return this;
};

ExpressControllerTester.prototype.asResponse = function(expectedFunc) {
  this.expectedFuncs.push(expectedFunc);
  return this;
};

/**
 * Provide a validator to verify the request.
 * The validator accepts 2 params: status code and body (which can be an error)
 * @param validator
 */
ExpressControllerTester.prototype.withValidation = function(validator) {
  try {
    this.testFunc(this.req, this.res);
  } catch(err) {
    this.doneFunc(err);
  }
  this.deferredResult.promise.then(function(result) {
    try {
      validator(result.body, result.status);
    } catch(err) {
      this.doneFunc(err);
      return;
    }
    this.doneFunc();
  }.bind(this), function(err) {
    this.doneFunc(err);
  }.bind(this));
};

exports.doRequest = function(testfunc, doneFunc) {
  return new ExpressControllerTester(testfunc, doneFunc);
};
