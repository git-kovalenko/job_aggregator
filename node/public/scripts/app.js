"use strict"
// var vacancyTable = angular.module("vacancyTable", ["ngRoute", "solo.table", "myFilters", "ngSanitize"]);

AppFactory("firstId", "vacancyTable", ["ngRoute", "solo.table", "myFilters", "ngSanitize"]);



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

			// Здесь приведен код, упрощающий создание нового AngularJS приложения
			// Создаем приложение с именем example, вставляем его в элемент testApp,
			// добавляем в него таблицу
			AppFactory("testApp", "example", ["solo.table", "myFilters", "ngSanitize"]);