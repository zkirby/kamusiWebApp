
angular.module('webappApp')
    .service('nameAddrService', function() {
    'use strict';

     var nameAndAddr = {};

     this.set = function(data) {
        nameAndAddr = data;
     };

     this.get = function(name) {
        if (name === "rest") {
            return nameAndAddr.name;
        } else if (name === "addr") {
            return nameAndAddr.address;
        }
		else if(name === "lang")
		{
			return nameAndAddr.language;
		}
     };
});