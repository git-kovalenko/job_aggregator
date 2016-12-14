"use strict"
vacancyTable.controller("getAllTable", function($scope, $http){
    // $scope.nameChange = function(){
    //  $scope.greeting = "Hello " + $scope.name + '!';
    // }
    // $scope.nameChange()

    $scope.update = function() {
        $http.get("/getAll")
            .success(function(rows) {
                $scope.rows = rows;
            });
    };
    $scope.update();
});
vacancyTable.controller("tablesolo", function($scope, $http){
	$scope.update = function() {
        $http.get("/getAll")
            .success(function(rows) {
                $scope.rows = rows;
            });
    };
    $scope.update();
});

