"use strict"
var vacancyTable = angular.module("vacancyTable", ['ngRoute']);

vacancyTable.config(function($routeProvider) {
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