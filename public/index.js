"use strict"
var c = console;
var mainApp = angular.module("mainApp", ["ngRoute", "solo.table", "myFilters", "ngSanitize", "ngMaterial"]);

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
		when('/vacancies', {
			templateUrl: 'modules/vacancies/vacancies.html',
			controller: 'vacancies'
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
					}])
				.filter('typeof', function() {
					return function(obj) {
						return typeof obj
					};
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
mainApp.directive('changeHeader', function () {
    return {
        restrict: 'A',
        scope: {
            'isactive': '='
        },
        link: function (scope, element, attrs) {
            scope.$watch('isactive', function(isactive){
                if(isactive){
                    scope.$parent.headerTemplate = attrs['headerlink'];
                }
            });
        }
    }
});
"use strict"
mainApp.controller("contactsController", function($scope){
    // c.log($scope.controllerName)
    
});

"use strict"
mainApp.controller("cvController", function($scope){
    $scope.certificates = [{
    	img: 'doc/img/angular.jpg',
    	link: 'doc/AngularJS certificate.pdf'
    },{
    	img: 'doc/img/upper.jpg',
    	link: 'doc/ENG certificate.pdf'
    }]
});

mainApp.controller("homeController", function($scope){
    c.log($scope.controllerName)
   
});

mainApp.controller("portfolioController", function($scope, $http){
    c.log($scope.controllerName)
    
    
    $scope.portfolio = [];
    $scope.$parent.uniqTech = [];
    $scope.order = 0;
    var update = function() {
        $http.get("/dbPortfolio").then(
            function(resp) {
                $scope.portfolio = resp.data;
                $scope.getUniqProp($scope.portfolio, 'technologies', $scope.$parent.uniqTech )
            },
            function(resp) {
                $scope.error = resp.statusText;
                c.log(resp)
            }
        )
    };
    update();
    
    $scope.getUniqProp = function(obj, prop, result) {
        for (var item in obj){
            var arr = obj[item][prop]
            for(var i = 0; i < arr.length; i++){
                if (result.indexOf(arr[i]) == -1) result.push(arr[i]);
            }
        }
        return result
    }



    $scope.add = function() {
        var notes = [{
            order: 8,
            date: new Date(),
            title: "This site",
            img: "thissite.jpg",
            text: "This site besides information about me contains the page for monitoring and sorting of current vacancies.",
            restricted: 'false',
            git: "https://github.com/git-kovalenko/job_aggregator",
            link: "http://scriptforge.herokuapp.com/tablesolo",
            technologies: [ 'NodeJS', 'AngularJS', 'Angular-material', 'expressJS', 'MongoDB', 'MySQL', 'Bootstrap', 'JS/Jquery']
        },{
            order: 7,
            date: new Date(),
            title: "Alfa Bank + Wargaming card emitting project",
            img: "karta_tankista.png",
            text: "Joint project between Alfa Bank and Wargaming for contragent registration, emitting game debit cards and delivery logistic system for them. I can't show code samples here due to Non-disclosure agreement.",
            restricted: 'true',
            link: "https://alfabank.ua/en/private-persons/pakety-uslug/WOT",
            technologies: [ 'Groovy', 'Grails', 'SOAP', 'Html/CSS', 'JS/Jquery']
        },{
            order: 6,
            date: new Date(),
            title: "Alfa Bank CRM project for Service packages",
            img: "platinum.png",
            text: "CRM integrated web application for registration of package cards, deposits and other card manipulations. Application works directly with bank SOAP microservices, which handle customer accounts and other private information, therefore it has strong sequrity requirements. Non-disclosure agreement forbids me from listing work samples here.",
            restricted: 'true',
            technologies: [ 'Groovy', 'Grails', 'SOAP', 'Html/CSS', 'JS/Jquery']

        },{
            order: 5,
            date: new Date(),
            title: "Official site of ICTV channel",
            img: "ictv.jpg",
            text: "Новостной сайт с множеством страниц и колонок, адаптивная верстка по .PSD макетам под Wordpress.",
            link: "http://ictv.ua/",
            git: "",
            technologies: ['Html/CSS', 'JS/Jquery', 'Wordpress']

        },{
            order: 1,
            date: new Date(),
            title: "Responsive page on clear CSS",
            img: "helth.jpg",
            text: "Страница сверстана по .PSD макетам. Макетов два - обычный и с адаптацией для узких дисплеев. Адаптивность реализована на чистом CSS без использования фреймворков.",
            link: "projects/helth/index.html",
            git: "https://github.com/git-kovalenko/helth-page",
            technologies: ['Html/CSS']

        },{
            order: 2,
            date: new Date(),
            title: "Web page with sliders",
            img: "bonfire.jpg",
            text: "Страница сверстана по .PSD макету. Адаптивная по ширине от 600 до 940 px. Добавлен скрипт для слайдеров.",
            link: "projects/web-page-bonfire/bonfire.html",
            git: "https://github.com/git-kovalenko/web-page-bonfire",
            technologies: ['Html/CSS','JS/Jquery']

        },{
            order: 3,
            date: new Date(),
            title: "Ray tracing in integrating sphere",
            img: "sphere.jpg",
            text: "В проекте реализовано 2-мерное моделирование лучей светодиода внутри сферы, покрытой изнутри светорассеивающим материалом. Сфера имеет перегородку, размер и положение которой можно изменять мышью. Для отрисовки сферы использован <canvas>, график освещенности выводится с помощью JS библиотеки AmCharts или Google Charts.",
            link: "projects/sphere/index.html",
            git: "https://github.com/git-kovalenko/sphere",
            technologies: ['Html/CSS','JS/Jquery', 'AmCharts', 'Google Charts']

        },{
            order: 4,
            date: new Date(),
            title: "Work wear database",
            img: "id_reader.jpg",
            text: "Проект разработан для учета оборота спецодежды между подрядчиком и заказчиком. Веб интерфейс работает со сканером штрих-кодов, автоматически связываясь с базой данных MySQL на сервере. Реализовано разграничение прав пользователей, учтены все требования заказчика по взаимодействию пользователей с базой данных, в том числе импорт в базу данных из .txt файла, а также выборка по параметрам с генерацией отчета в формате файла Excel.",
            link: "#",
            git: "https://github.com/git-kovalenko/ID-reader",
            technologies: ['Html/CSS','JS/Jquery', 'PHP/Kohana', 'PHPExcel', 'MySQL']


        }];
        $http.post("/dbPortfolioAdd", notes).then(
            function() {
                update();
            },
            function(resp) {
                $scope.error = resp.statusText;
                c.log(resp)
            }
        );
    };

    $scope.remove = function(id){
        $http.delete("/dbPortfolio", {params: {id:id}}).then(
			function () {
				update();
			},
			function(resp) {
				$scope.error = resp.statusText;
				c.log(resp)
			}
        );
    }

    $scope.add();
});

"use strict"

mainApp.controller("vacancies", function($scope, $http){
	$scope.update = function() {
        $http.get("/getAll")
            .then(function(response) {
                $scope.rows = response.data;
            });
    };
    
});

