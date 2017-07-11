'use strict';


angular.module('webappApp', ['ngResource', 'ui.router', 'ui.bootstrap', 'ngFileUpload', 'dndLists'])
    .constant('baseURL', "http://localhost:3000/")
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html'
                    },
                    'content': {
                        templateUrl : 'views/home.html'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html'
                    }
                }
        })
        .state('app.restaurant', {
            
            views: {
                'content@': {
                    templateUrl : 'views/form.html'
                }
            }
        });

        
        $urlRouterProvider.otherwise('/');
});
