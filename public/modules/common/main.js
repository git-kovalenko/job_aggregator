"use strict"
var c = console;
var mainApp = angular.module("mainApp", ["ngRoute", "solo.table", "myFilters", "ngSanitize"]);

mainApp.config(function($routeProvider, $locationProvider, $httpProvider) {
	$locationProvider.html5Mode(true);
	// Expose XHR requests to server 
  	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
	$routeProvider.
		when('/tablesolo', {
			templateUrl: 'modules/vacancies/tablesolo.html',
			controller: 'tablesolo'
		}).
		otherwise({
			redirectTo: '/'
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
					}]);

			