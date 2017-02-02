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
