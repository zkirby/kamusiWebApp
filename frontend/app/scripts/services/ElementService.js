//handles elements, creating and stuff
angular.module('webappApp')
    .service('elementService', function() {
        'use strict';
        
        //creates an element, with a default
        this.createElem = function(section, subsection, name, description, ingredients, nbPeople, labels, meal, day) {
            return {
                section: section || "", 
                subsection: subsection || "",
                item: {
                    name: name || "", 
                    description: description || "", 
                    ingredients: ingredients || [], 
                    nbPeople: nbPeople || 1,
                    labels: labels || [{name: "Spicy", selected: false}, {name: "Vegeterian", selected: false}, {name: "Long preparation", selected: false}],
                    meal: meal || {breakfast: false, brunch: false, lunch: true, earlybird: false, happyhour: false, dinner: true, latenight: false},
                    day: day || {monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true}
                }
                
            };
        };
        //creates an 'oldElem' as it is by default
        this.defaultOldElem = function() {
            return this.createElem("", "", "", "", []);
        };
});