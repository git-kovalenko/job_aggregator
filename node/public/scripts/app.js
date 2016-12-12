"use strict"
var vacancyTable = angular.module("vacancyTable", ['ngRoute']);

vacancyTable.config(function($routeProvider) {
	$routeProvider.
		when('/table', {
			templateUrl: 'vacancyTable.html',
			controller: 'getAllTable'
		}).
		otherwise({
			redirectTo: '/'
		});	
});