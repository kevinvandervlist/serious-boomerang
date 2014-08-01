'use strict';

angular.module('seriousBoomerangApp')
  .factory('RXUtils', function (rx) {

    function observableResource(promise) {
      return rx.Observable
        .fromPromise(promise)
        .map(function (response) {
          return response.data;
        });
    }

    return {
      observableResource: function(promise) {
        return observableResource(promise);
      },
      observableResourceList: function(promise) {
        return observableResource(promise)
          .flatMap(rx.Observable.fromArray);
      }
    };
  });
