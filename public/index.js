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

			
"use strict"
mainApp.controller("headerController", function($scope){
    console.log('--headerController')
    $scope.navProperties= {
    	flipStart : 50,
		pageScrolled : false
	}
});
mainApp.directive('appScrollFlip', function(){
	return{
		restrict: 'EA',
		replace: false,
		link: function(scope, element, attrs){
			angular.element(window).on('scroll', function() {
				if(window.pageYOffset > scope.navProperties.flipStart ){
					if(scope.navProperties.pageScrolled == false){
						scope.navProperties.pageScrolled = true;
						scope.$apply();
					}
				}else{
					if(scope.navProperties.pageScrolled == true){
						scope.navProperties.pageScrolled = false;
						scope.$apply();	
					}
				}
			});
		}

	}
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

