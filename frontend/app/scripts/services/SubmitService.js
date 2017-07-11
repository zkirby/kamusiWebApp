//Sends the menu to the backend
angular.module('webappApp')
    .service('submitService', ['$http', 'baseURL', function($http, baseURL) {
        'use strict';
        
        this.submit = function(restaurant) {
            console.log("restaurant: ");
            var req = {
             method: 'POST',
             url: baseURL + 'submit',
             
             data: { restaurant: restaurant }
            };
            console.log(restaurant); //DEBUG
            return $http(req);
        };
}]);