'use strict';

var Q = require('q');

exports.waitForCompletion = function() {
  return Q.all(arguments);
};

/**
 * Get a single object from a mongoose model, given supplied constraints, and return a promise for the result.
 * @param model The mongoose model
 * @param constraint The constrains
 * @returns {Promise.promise|*}
 */
exports.getAsPromiseOne = function (model, constraint) {
  var defer = Q.defer();

  model.findOne(constraint, function(err, result) {
    if (err) {
      defer.reject(err);
    }
    defer.resolve(result);
  });

  return defer.promise;
};
