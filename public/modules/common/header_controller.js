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
