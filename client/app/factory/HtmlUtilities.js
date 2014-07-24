angular.module('seriousBoomerangApp')
  .factory('HtmlUtilities', function ($sce) {
    function concatArguments(arguments, separator) {
      var args = Array.prototype.slice.call(arguments, 0);
      return args.join(separator);
    }

    function mediaIsType(media, type) {
      if(!media) { return false; }
      return media.mediaType === type;
    }

    return {
      asTrustedResource: function () {
        return $sce.trustAsResourceUrl(concatArguments(arguments, ''));
      },
      isImage: function(media) {
        return mediaIsType(media, 'image');
      },
      isVideo: function(media) {
        return mediaIsType(media, 'video');
      }
    }
  });
