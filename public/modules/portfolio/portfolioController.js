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
        var note = {
            order: $scope.order ++,
            date: new Date(),
            title: "Ray tracing in integrating sphere",
            img: "sphere.jpg",
            text: "В проекте реализовано 2-мерное моделирование лучей светодиода внутри сферы, покрытой изнутри светорассеивающим материалом. Сфера имеет перегородку, размер и положение которой можно изменять мышью. Для отрисовки сферы использован <canvas>, график освещенности выводится с помощью JS библиотеки AmCharts или Google Charts.",
            page: "sphere.3d-foto.in.ua"
        };
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

    // $scope.add();
});
