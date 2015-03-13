


'use strict';

/**
 * @ngdoc function
 * @name soundscoreangularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the soundscoreangularApp
 */
angular.module('soundscoreangularApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    angular.extend($scope, {
        //todo zoom not working.. didn't work in defaults either
        center:{
            lat: 37.767358,
            long: -122.430467,
            zoom: 13
        },
        //defaults: {
        //    scrollWheelZoom: false
        //}
    });
  });
