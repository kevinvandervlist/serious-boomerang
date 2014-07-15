'use strict';

angular.module('seriousBoomerangApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('welkom', {
        url: '/',
        templateUrl: 'app/welkom/welkom.html',
      });
  });