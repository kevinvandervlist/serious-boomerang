'use strict';


angular.module('seriousBoomerangApp')
  .controller('UploadEventsCtrl', function ($scope, $stateParams, URLFactory, authInterceptor, ngProgress) {
    function emitUploadStatus(status) {
      $scope.$emit('uploadStatus', status);
    }

    $scope.flowInit = function() {
      return {
        target: URLFactory.uploadFileToAlbum($stateParams.year, $stateParams.name),
        headers: {
          'Authorization': 'Bearer ' + authInterceptor.token()
        }
      };
    };

    $scope.$on('flow::filesSubmitted', function () {
    });

    $scope.$on('flow::complete', function () {
      ngProgress.complete();
      emitUploadStatus('success');
    });

    $scope.$on('flow::uploadStart', function () {
      ngProgress.start();
      emitUploadStatus('start');
      ngProgress.height('3px');
    });

    $scope.$on('flow::error', function () {
      console.error('error');
      ngProgress.complete();
      emitUploadStatus('error');
    });

    $scope.$on('flow::progress', function (event, flow) {
      ngProgress.set(flow.progress() * 100);
    });
  })
  .controller('AlbumUploadCtrl', function ($scope, $stateParams) {
    $scope.albumName = $stateParams.name;
    $scope.progress = undefined;

    $scope.$on('uploadStatus', function(event, message) {
      switch (message) {
        case 'start':
          $scope.progress = 'De upload is gestart.';
          break;
        case 'success':
          $scope.progress = 'De upload is voltooid. De bestanden worden nu automatisch toegevoegd aan het album. Bedankt voor het uploaden!';
          break;
        case 'error':
          $scope.progress = 'Er is iets foutgegaan!';
          break;
      }
    });
  });