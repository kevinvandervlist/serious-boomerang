angular.module('seriousBoomerangApp')
  .factory('HtmlUtilities', function ($sce) {
    function concatArguments(arguments, separator) {
      var args = Array.prototype.slice.call(arguments, 0);
      return args.join(separator);
    }

    return {
      asTrustedResource: function () {
        if(typeof arguments[0] === 'object') {
          console.log(concatArguments(arguments, ''));
        }
        return $sce.trustAsResourceUrl(concatArguments(arguments, ''));
      }
    }
  });
