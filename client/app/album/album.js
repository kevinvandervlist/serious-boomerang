'use strict';

angular.module('seriousBoomerangApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('albumlist', {
        url: '/album',
        templateUrl: 'app/album/list/list.html',
        controller: 'AlbumListCtrl'
      })
      .state('albumview', {
        url: '/album/:year/:name',
        templateUrl: 'app/album/view/view.html',
        controller: 'AlbumViewCtrl'
      })
      .state('albumupload', {
        url: '/album/:year/:name/upload',
        templateUrl: 'app/album/upload/upload.html',
        controller: 'AlbumUploadCtrl'
      });
  });