'use strict';

angular.module('seriousBoomerangApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('info', {
        url: '/upload/info',
        templateUrl: 'app/upload/info/info.html',
        controller: 'UploadInfoCtrl'
      })
      .state('uploadview', {
        url: '/upload/:year/:name',
        templateUrl: 'app/upload/upload/upload.html',
        controller: 'UploadCtrl'
      });
  });