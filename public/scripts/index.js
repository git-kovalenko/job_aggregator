"use strict"
var mainApp = angular.module("mainApp", ["ngRoute", "solo.table", "myFilters", "ngSanitize"]);

mainApp.config(function($routeProvider, $locationProvider, $httpProvider) {
	$locationProvider.html5Mode(true);
	// Expose XHR requests to server 
  	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
	
	$routeProvider.
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

			
"use strict"

mainApp.controller("mController", function($scope, $http){
	$scope.ale = function() {
        console.log('---mController')
    };
    
});


"use strict"

mainApp.controller("tablesolo", function($scope, $http){
	$scope.update = function() {
        $http.get("/getAll")
            .success(function(rows) {
                $scope.rows = rows;
            });
    };
    
});

