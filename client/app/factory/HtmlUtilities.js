'use strict';
/*jshint -W024 */

angular.module('seriousBoomerangApp')
  .factory('HtmlUtilities', function ($sce) {
    function concatArguments(args, separator) {
      return Array.prototype.join.call(args, separator);
    }

    return {
      asTrustedResource: function () {
        if(typeof arguments[0] === 'object') {
          console.log(concatArguments(arguments, ''));
        }
        return $sce.trustAsResourceUrl(concatArguments(arguments, ''));
      },
      humanReadableTimestamp: function(timestamp) {
        var d = new Date(timestamp);
        return d.toString();
      },
      humanReadableDate: function(date) {
        var d = new Date(date);
        return d.getDate() + '-' + (d.getMonth() + 1) + '-' + d.getFullYear();
      },
      getYearFromDate: function(date) {
        var d = new Date(date);
        return d.getFullYear();
      }
    };
  });
