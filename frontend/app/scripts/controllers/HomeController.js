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
            restaurant_address: "",
		 restaurant_language: ""
        };

        $scope.passnames = function(restname, addername, lang) {
        	var combined = {
        		name: restname,
        		address: addername,
			language: lang
        	};
        	console.log("It worked!");
        	console.log(restname + " !! " + addername + " !! " + lang);

        	nameAddrService.set(combined);
        };
    }]);

