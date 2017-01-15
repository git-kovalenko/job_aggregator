"use strict"

mainApp.controller("tablesolo", function($scope, $http){
	$scope.update = function() {
        $http.get("/getAll")
            .success(function(rows) {
                $scope.rows = rows;
            });
    };
    
});

