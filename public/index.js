"use strict"
var c = console;
var mainApp = angular.module("mainApp", ["ngRoute", "solo.table", "myFilters", "ngSanitize"]);

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
					}]);

			
"use strict"
mainApp.controller("homeController", function($scope){
    c.log($scope.controllerName)
    $scope.$parent.headerTemplate = 'modules/home/homeHeaderTemplate.html';
});

"use strict"
mainApp.controller("headerController", ['$scope', '$location', function($scope, $location){
    c.log("[" + $scope.controllerName +"] got here");
    
    $scope.navProperties= {
    	flipStart : 50,
		pageScrolled : false
	}
	$scope.isActive = function(destination){
		return destination === $location.path();
	}
	$scope.changeHeader = function(){
		$scope.$parent.headerTemplate = '';
	}

}]);
mainApp.directive("ngBgSlideshow", function($interval) {
    return {
        restrict: 'A',
        scope: {
            ngBgSlideshow: '&',
            interval: '=',
        },
        templateUrl: 'modules/common/slideshow.html',
        link: function( scope, elem, attrs ) {
            scope.$watch( 'ngBgSlideshow', function(val) {
                scope.images = val();
                scope.active_image = 0;
            });

            var change = $interval(function() {
                scope.active_image++;
                if( scope.active_image >= scope.images.length )
                    scope.active_image = 0;
            }, scope.interval || 1000 );
        
            scope.$on('$destroy', function() {
                $interval.cancel( change );
            });
        }
    };  
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
            .then(function(response) {
                $scope.rows = response.data;
            });
    };
    
});


"use strict"
mainApp.controller("cvController", function($scope){
    $scope.$parent.headerTemplate = 'modules/cv/cvHeaderTemplate.html';
    
    
});

"use strict"
mainApp.controller("contactsController", function($scope){
    c.log($scope.controllerName)
    
});

"use strict"
mainApp.controller("portfolioController", function($scope){
    c.log($scope.controllerName)
    
});
