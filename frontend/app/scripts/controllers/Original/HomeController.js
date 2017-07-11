'use strict';

/**
 * @ngdoc function
 * @name webappApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the webappApp
 */
angular.module('webappApp')
  .controller('HomeController', ['$scope', 'nameAddrService', function ($scope, nameAddrService) {
        //init all the variables
        $scope.model = {
            restaurant_name: "", 
            restaurant_address: ""
        };

        $scope.passnames = function(restname, addername) {
        	var combined = {
        		name: restname,
        		address: addername
        	};
        	console.log("It worked!");
        	console.log(restname + " !! " + addername);

        	nameAddrService.set(combined);
        };
    }]);

