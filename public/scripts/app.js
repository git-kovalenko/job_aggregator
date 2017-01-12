"use strict"
var vacancyTable = angular.module("vacancyTable", ["ngRoute", "solo.table", "myFilters", "ngSanitize"]);





vacancyTable.config(function($routeProvider, $locationProvider, $httpProvider) {
	$locationProvider.html5Mode(true);
	// Expose XHR requests to server
  	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
	$routeProvider.
		when('/table', {
			templateUrl: 'views/vacancyTable.html',
			controller: 'getAllTable'
		}).
		when('/tablesolo', {
			templateUrl: 'views/tablesolo.html',
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

			