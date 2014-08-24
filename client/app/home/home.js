'use strict';

angular.module('seriousBoomerangApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        controller: 'homeCommentCtrl',
        templateUrl: 'app/home/home.html'
      });
  });