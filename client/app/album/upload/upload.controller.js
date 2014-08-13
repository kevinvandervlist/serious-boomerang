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

    $scope.$on('flow::filesSubmitted', function () {
      console.log('Files submitted');
    });

    $scope.$on('flow::complete', function () {
      console.log('Upload complete');
    });

    $scope.$on('flow::uploadStart', function () {
      console.log('Starting upload');
    });

    $scope.$on('flow::error', function () {
      console.error('error');
    });

    $scope.$on('flow::progress', function (event, flow) {
      var percentCompleted = Math.round(arguments[1].progress() * 100);
      console.log('progress: ' + percentCompleted + ' %.');
    });
  })
  .controller('AlbumUploadCtrl', function ($scope, $stateParams) {
    $scope.albumName = $stateParams.name;
  });