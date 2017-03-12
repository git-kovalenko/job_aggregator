"use strict"
var c = console;
var mainApp = angular.module("mainApp", ["ngRoute", "solo.table", "myFilters", "ngSanitize", "ngMaterial"]);

mainApp.config(function($routeProvider, $locationProvider, $httpProvider) {
	$locationProvider.html5Mode(true);
	// Expose XHR requests to server 
  	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
	$routeProvider.
		when('/', {
			templateUrl: 'modules/home/home.html',
			controller: 'homeController'
		}).
		when('/cv', {
			templateUrl: 'modules/cv/cv.html',
			controller: 'cvController'
		}).
		when('/portfolio', {
			templateUrl: 'modules/portfolio/portfolio.html',
			controller: 'portfolioController'
		}).
		when('/contacts', {
			templateUrl: 'modules/contacts/contacts.html',
			controller: 'contactsController'
		}).
		when('/tablesolo', {
			templateUrl: 'modules/vacancies/tablesolo.html',
			controller: 'tablesolo'
		}).
		otherwise({
			redirectTo: '/'
		});
});

mainApp.config(function($provide) {
    $provide.decorator('$controller', function($delegate) {
        return function(constructor, locals, later, indent) {
            if (typeof constructor === 'string' && !locals.$scope.controllerName) {
                locals.$scope.controllerName =  constructor;
            }
            return $delegate(constructor, locals, later, indent);
        };
    });
});

			angular.module("myFilters", [])
				.filter("highlight", ['$sce', function($sce){
						return function(text, search){

							if (!search)
								return text;

							var re = new RegExp('('+ search +')', 'gi');
							var out = text.replace(re, "<strong style='color: red;'>$1</strong>");

							return $sce.trustAsHtml(out);
						};
					}])
				.filter('typeof', function() {
				return function(obj) {
					return typeof obj
				};
			});
				