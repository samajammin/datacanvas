/**
 * Created by samrichards on 3/13/15.
 */
'use strict';

/**
 * @ngdoc function
 * @name soundscoreangularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the soundscoreangularApp
 */
angular.module('soundscoreangularApp')
  .controller('MapCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    angular.extend($scope, {
        defaults: {
            scrollWheelZoom: false
        }
    });
  });
