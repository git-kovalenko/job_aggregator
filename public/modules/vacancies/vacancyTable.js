"use strict"

mainApp.controller("tablesolo", function($scope, $http){
	$scope.update = function() {
        $http.get("/getAll")
            .then(function(response) {
                $scope.rows = response.data;
            });
    };
    
});

