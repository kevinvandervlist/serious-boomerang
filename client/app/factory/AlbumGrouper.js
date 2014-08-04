'use strict';

angular.module('seriousBoomerangApp')
  .factory('AlbumGrouper', function (rx, RXUtils) {
    return {
      groupByYear: function (promise) {
        return RXUtils.observableResourceList(promise)
          .groupBy(function(album) {
            return new Date(album.startDate).getFullYear();
          });
      }
    };
  });
