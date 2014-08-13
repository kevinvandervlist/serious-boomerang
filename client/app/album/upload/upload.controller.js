'use strict';


angular.module('seriousBoomerangApp')
  .controller('UploadEventsCtrl', function ($scope, $stateParams, URLFactory, authInterceptor) {
    $scope.flowInit = function() {
      return {
        target: URLFactory.uploadFileToAlbum($stateParams.year, $stateParams.name),
        headers: {
          'Authorization': 'Bearer ' + authInterceptor.token()
        }
      };
    };

    $scope.$on('flow::fileAdded', function () {
      console.log('fileAdded');
    });

    $scope.$on('flow::flowProgress', function () {
      console.log('flowProgress');
    });

    $scope.$on('flow::catchAll', function () {
      console.log('catchAll');
    });
  })
  .controller('AlbumUploadCtrl', function ($scope, $stateParams) {
    $scope.albumName = $stateParams.name;
  });