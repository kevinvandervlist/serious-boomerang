'use strict';

angular.module('seriousBoomerangApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
      .state('createuser', {
        url: '/admin/createuser',
        templateUrl: 'app/admin/createuser/createuser.html',
        controller: 'createUserCtrl'
      })
      .state('modifyuser', {
        url: '/admin/modifyuser',
        templateUrl: 'app/admin/modifyuser/modifyuser.html',
        controller: 'modifyUserCtrl'
      })
      .state('albumpermissions', {
        url: '/admin/albumpermissions',
        templateUrl: 'app/admin/albumpermissions/albumpermissions.html',
        controller: 'albumPermissionsCtrl'
      });
  });