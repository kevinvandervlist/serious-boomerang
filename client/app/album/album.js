'use strict';

angular.module('seriousBoomerangApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('album', {
        url: '/album',
        templateUrl: 'app/album/album.html',
        controller: 'AlbumCtrl'
      });
  });