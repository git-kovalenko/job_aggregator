"use strict"
var demoApp = angular.module("DemoApp", []);

demoApp.controller("MainController", function($scope){
	$scope.nameChange = function(){
		$scope.greeting = "Hello " + $scope.name + '!';
	}
	$scope.nameChange()
});

demoApp.controller("PhoneListCtrl", function($scope){
	$scope.phones = [
		{'name': 'Nexus s',
		'snippet': 'Faster with Nexus'
		},
		{'name': 'Motorola Xoom',
		'snippet':'The next generation tablett'
		},
		{'name': 'Samsung',
		'snippet': 'Very smart phone'
		}

	]
});