'use strict';

/**
 * Determine whether a string exists and has a length > 0
 * @param string
 * @returns {boolean}
 */
exports.isNotEmpty = function(string) {
  if (string && string.length) {
    return string.length > 0;
  } else {
    return false;
  }
};