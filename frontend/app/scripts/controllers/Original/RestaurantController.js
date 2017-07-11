'use strict';


angular.module('webappApp')
    .controller('RestaurantController', ['$scope', '$uibModal', 'lookupService', 'elementService', 'nameAddrService', 'submitService',  function ($scope, $uibModal, lookupService, elementService, nameAddrService,submitService) {
        //init all the variables
        $scope.model = {
            sectionButtons: [], 
            menu: [], 
            menuElem: elementService.createElem(), 
            potentialIngredients: [],
            missing_term: "",
            restaurant_name: nameAddrService.get('rest'),
            restaurant_address: nameAddrService.get('addr')
        };
        
        //will have to be retrieved
        var bestSections = [{name: "Entree", subsectionButtons: ["Pasta", "Pizza"]}, {name: "Drinks", subsectionButtons: ["Wine", "Beer"]}];
        
        bestSections.forEach(function(el) {
           $scope.model.sectionButtons.push(JSON.parse(JSON.stringify(el)));
        });
        /*
            menu = [{
                name: section1,
                subsections: [{
                    name: subsection1,
                    items: [{
                        name: item1,
                        ingredients:[],
                        ...
                        },
                        {
                        name:item2,
                        ingredients:[],
                        ...
                        }
                    ]
                }]
            }]
        
        */
        

        
        //those two variables are for when an element is updated rather than created.
        var update = false;
        var oldElem = elementService.defaultOldElem();
        
        //adds an element to the menu
        $scope.addElement = function() {
            if(update) {
                removeElement();
                update = false;
                oldElem = elementService.defaultOldElem();
            }
            
            
            var newItem = JSON.parse(JSON.stringify($scope.model.menuElem.item));
            newItem.image = $scope.model.menuElem.item.image;
            var sectionIndex = indexWithProperty($scope.model.menu, "name", $scope.model.menuElem.section);
            var subsectionIndex = -1;
            if(sectionIndex >= 0) {
                subsectionIndex = indexWithProperty($scope.model.menu[sectionIndex].subsections, "name", $scope.model.menuElem.subsection);
                if(subsectionIndex >= 0) {
                    $scope.model.menu[sectionIndex].subsections[subsectionIndex].items.push(newItem);
                } else {
                    $scope.model.menu[sectionIndex].subsections.push({name: $scope.model.menuElem.subsection, items: [newItem]});
                }
            } else {
                $scope.model.menu.push({name: $scope.model.menuElem.section, subsections:[{name: $scope.model.menuElem.subsection, items: [newItem]}]});
            }
            
            $scope.model.menuElem = elementService.createElem();
            $scope.model.potentialIngredients = [];
        };
        
        //prepares the removal of an element
        $scope.modifyElement = function(section, subsection, item) {
            update = true;
            $scope.model.menuElem.section = section;
            oldElem.section = section;
            $scope.model.menuElem.subsection = subsection;
            oldElem.subsection = subsection;
            $scope.model.menuElem.item = JSON.parse(JSON.stringify(item));
            $scope.model.menuElem.item.image = item.image;
            oldElem.item = JSON.parse(JSON.stringify(item));
            oldElem.item.image = item.image;
            angular.forEach($scope.menuForm, function(val, key) {
                if(!key.match(/\$/)) {
                    val.$setDirty();
                }
            });
        };
        
        
        //removes an element from the menu
        function removeElement() {
            var sectionIndex = indexWithProperty($scope.model.menu, "name", oldElem.section);
            var subsectionIndex = -1;
            var itemIndex = -1;
            if(sectionIndex >= 0) {
                subsectionIndex = indexWithProperty($scope.model.menu[sectionIndex].subsections, "name", oldElem.subsection);
                if(subsectionIndex >= 0) {
                    itemIndex = indexWithProperty($scope.model.menu[sectionIndex].subsections[subsectionIndex].items, "name", oldElem.item.name);
                }
            }
            if(sectionIndex >= 0 && subsectionIndex >= 0 && itemIndex >= 0) {
                $scope.model.menu[sectionIndex].subsections[subsectionIndex].items.splice(itemIndex, 1);
                if($scope.model.menu[sectionIndex].subsections[subsectionIndex].items.length === 0) {
                    $scope.model.menu[sectionIndex].subsections.splice(subsectionIndex, 1);
                    if($scope.model.menu.length === 0) {
                        $scope.model.menu.splic(sectionIndex, 1);
                    }
                }
                
            } else {
                throw "Trying to remove an element that doesn't exist! " + oldElem.section + " " + oldElem.subsection + " " + oldElem.item.name;
            } 
        }      
        
        
        //adds a section to the menu
        $scope.addSection = function() {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../../templates/sectionModal.html"
                
            });
            
            modal.result.then(
                function(res) {
                    if(res) {
                        $scope.model.sectionButtons.push({name: res, subsectionButtons: []});
                        $scope.model.menuElem.section = res;
                    }
                }, function(err) {
                    throw err;
                }
            );
        };
        
        //returns the list of potential subsections for the selected section. 
        $scope.getSubsectionButtons = function() {
            return $scope.model.sectionButtons[indexWithProperty($scope.model.sectionButtons, "name", $scope.model.menuElem.section)].subsectionButtons;
        };
        
        //adds a subsection to the selected section
        $scope.addSubsection = function() {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../../templates/subsectionModal.html"
                
            });
            
            modal.result.then(
                function(res) {
                    if(res) {
                        $scope.model.sectionButtons[indexWithProperty($scope.model.sectionButtons, "name", $scope.model.menuElem.section)].subsectionButtons.push(res);
                        $scope.model.menuElem.subsection = res;
                    } else {
                        console.log("cancel");
                    }
                }, function(err) {
                    throw err;
                }
            );
        };
        

        //looks up the description, gets a list of everything that's possible and displays it in a modal 
        $scope.ingredientsFromDescription = function() {
            $scope.model.potentialIngredients = [];
            $scope.model.menuElem.item.ingredients = [];
            lookupService.lookup($scope.model.menuElem.item.description).then(
                function(resp){
                    resp.data.forEach(function(el) {
                        $scope.model.potentialIngredients.push({name: el});
                    });
                    
                }, function(err) {
                    throw err;
                }
            );
            
            
        };
        //This function looks up one or several words in the kamusi database
        /*function lookup(word) {
            lookupService.lookup(word).then(
                function(resp) {
                    return resp.data;
                },
                function(err) {
                    throw err;
                }
            );   
            
        }*/


            
        //Adds an empty element to the ingredient list
        $scope.addIngredient = function(name) {
            $scope.model.menuElem.item.ingredients.push({ingredient: name || "", descriptives:[]});
            return true;
        };
        
        //Removes the ingredient with the specified index from the ingredient list
        $scope.removeIngredient = function(index) {
            $scope.model.menuElem.item.ingredients.splice(index, 1);
        };
        
        //Adds an empty element to the descriptive list of an ingredient
        $scope.addDescriptive = function(parentIndex) {
            $scope.model.menuElem.item.ingredients[parentIndex].descriptives.push("");
        };
        
        //Removes the descriptive with the specified index from the ingredient specified by parentIndex
        $scope.removeDescriptive = function(index, parentIndex) {
            $scope.model.menuElem.item.ingredients[parentIndex].descriptives.splice(index, 1);
        };
        
        //Adds a term to the potential ingredients list. This should also notify the kamusi backend that this term is missing
        $scope.addMissingTerm = function() {
            if($scope.model.missing_term) {
                $scope.model.potentialIngredients.push({name: $scope.model.missing_term});
                $scope.model.missing_term = "";
            }        
        };
        
        $scope.addPotentialIngredient = function(ingredient) {
            $scope.model.potentialIngredients.push({name: ingredient}); 
            return true;
        };
        /*$scope.uploadImage = function(img) {
            img.upload = ngFileUpload
        }*/
        
        //Onclick function for the submit button. Important!
        $scope.submitMenu = function () {
            var modal = $uibModal.open({
                animation: false,
                templateUrl: "../../templates/confirmModal.html",
                scope: $scope,
                backdrop: 'static',
                keyboard: false 
            });

            
            modal.result.then(
                function(succ) {
                    if(succ) {
                        submitService.submit({name: $scope.model.restaurant_name, menu: $scope.model.menu}).then(function (resp) {
                            console.log(resp);
                        });
                    } else {
                        console.log("cancel");
                    }
                }, function(err) {
                    throw err;
                }
            );
        };

        //Helper function that returns the index of the first element of the array such that the array[index].prop === value
        function indexWithProperty(arr, prop, value) {
            for(var i = 0; i < arr.length; i++) {
                if(arr[i][prop] === value) {
                    return i;
                }
            }
            return -1;
        }
        
    }]);
