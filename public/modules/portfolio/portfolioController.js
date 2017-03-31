mainApp.controller("portfolioController", function($scope, $http){
    // c.log($scope.controllerName)
    
    
    $scope.portfolio = [];
    $scope.$parent.uniqTech = [];
    $scope.order = 0;

    //temprorary 
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



    var update = function() {
        $http.get("/dbPortfolio").then(
            function(resp) {
                c.log(resp.data)
                $scope.portfolio = resp.data || notes;
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

    // $scope.add();
});
