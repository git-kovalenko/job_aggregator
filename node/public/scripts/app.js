"use strict"
var vacancyTable = angular.module("vacancyTable", ['ngRoute']);

vacancyTable.config(function($routeProvider) {
	$routeProvider.
		when('/table', {
			templateUrl: 'views/vacancyTable.html',
			controller: 'getAllTable'
		}).
		otherwise({
			redirectTo: '/'
		});	
});