mainApp.controller("portfolioController", function($scope, $http){
    c.log($scope.controllerName)
    
    $scope.portfolio = [];
    $scope.order = 0;
    var update = function() {
        $http.get("/dbPortfolio").then(
        	function(resp) {
                $scope.portfolio = resp.data;
            },
            function(resp) {
                $scope.error = resp.statusText;
                c.log(resp)
            }
        )
    };
    update();


    $scope.add = function() {
        var notes = [{
            order: $scope.order ++,
            date: new Date(),
            title: "Official site of ICTV channel",
            img: "ictv.jpg",
            text: "Новостной сайт с множеством страниц и колонок, адаптивная верстка по .PSD макетам под Wordpress.",
            link: "http://ictv.ua/",
            git: "",
            technologies: ['Html/CSS', 'JS/Jquery', 'Wordpress']

        },{
            order: $scope.order ++,
            date: new Date(),
            title: "Responsive page on clear CSS",
            img: "helth.jpg",
            text: "Страница сверстана по .PSD макетам. Макетов два - обычный и с адаптацией для узких дисплеев. Адаптивность реализована на чистом CSS без использования фреймворков.",
            link: "projects/helth/index.html",
            git: "https://github.com/git-kovalenko/helth-page",
            technologies: ['Html/CSS']

        },{
            order: $scope.order ++,
            date: new Date(),
            title: "Web page with sliders",
            img: "bonfire.jpg",
            text: "Страница сверстана по .PSD макету. Адаптивная по ширине от 600 до 940 px. Добавлен скрипт для слайдеров.",
            link: "projects/web-page-bonfire/bonfire.html",
            git: "https://github.com/git-kovalenko/web-page-bonfire",
            technologies: ['Html/CSS','JS/Jquery']

        },{
            order: $scope.order ++,
            date: new Date(),
            title: "Ray tracing in integrating sphere",
            img: "sphere.jpg",
            text: "В проекте реализовано 2-мерное моделирование лучей светодиода внутри сферы, покрытой изнутри светорассеивающим материалом. Сфера имеет перегородку, размер и положение которой можно изменять мышью. Для отрисовки сферы использован <canvas>, график освещенности выводится с помощью JS библиотеки AmCharts или Google Charts.",
            link: "projects/sphere/index.html",
            git: "https://github.com/git-kovalenko/sphere",
            technologies: ['Html/CSS','JS/Jquery', 'AmCharts', 'Google Charts']

        },{
            order: $scope.order ++,
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
