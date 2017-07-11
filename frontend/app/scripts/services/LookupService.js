

//Generic lookup, needs to return a list of word or MWE matching the looked-up word;
angular.module('webappApp')
    .service('lookupService', ['$http', 'baseURL', function($http, baseURL) {
        'use strict';
        
        this.lookup = function(word) {
            
            var req = {
             method: 'POST',
             url: baseURL + 'kamusi',
             
             data: { word: word }
            };
            return $http(req);
        };
}]);