mainApp.controller("portfolioController", function($scope, $http){
    c.log($scope.controllerName)
    
    $scope.portfolio = [];
    $scope.order = 0;
    var update = function() {
        $http.get("/dbPortfolio").then(
        	function(resp) {
                $scope.portfolio = resp;
            },
            function(resp) {
                $scope.error = resp.statusText;
                c.log(resp)
            }
        )
    };
    update();


    $scope.add = function() {
        var note = [{
            order: $scope.order ++,
            date: new Date(),
            title: "Ray tracing in integrating sphere",
            img: "sphere.jpg",
            text: "В проекте реализовано 2-мерное моделирование лучей светодиода внутри сферы, покрытой изнутри светорассеивающим материалом. Сфера имеет перегородку, размер и положение которой можно изменять мышью. Для отрисовки сферы использован <canvas>, график освещенности выводится с помощью JS библиотеки AmCharts или Google Charts.",
            page: "sphere.3d-foto.in.ua"
        },{
            order: $scope.order ++,
            date: new Date(),
            title: "Work wear database",
            img: "id_reader.jpg",
            text: "Проект разработан для учета оборота спецодежды между подрядчиком и заказчиком. Веб интерфейс работает со сканером штрих-кодов, автоматически связываясь с базой данных MySQL на сервере. Реализовано разграничение прав пользователей, учтены все требования заказчика по взаимодействию пользователей с базой данных, в том числе импорт в базу данных из .txt файла, а также выборка по параметрам с генерацией отчета в формате файла Excel.",
            page: "idreader.3d-foto.in.ua"
        }];
        $http.post("/dbPortfolio", note).then(
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
