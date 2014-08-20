'use strict';

angular.module('seriousBoomerangApp')
  .directive('ngLeft', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 37) {
          scope.$apply(function () {
            scope.$eval(attrs.ngLeft);
          });

          event.preventDefault();
        }
      });
    };
  }).directive('ngRight', function () {
    return function (scope, element, attrs) {
      element.bind('keydown keypress', function (event) {
        if (event.which === 39) {
          scope.$apply(function () {
            scope.$eval(attrs.ngRight);
          });

          event.preventDefault();
        }
      });
    };
  });