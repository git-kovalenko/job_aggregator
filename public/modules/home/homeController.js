"use strict"
mainApp.controller("homeController", function($scope){
    c.log($scope.controllerName)
    $scope.$parent.headerTemplate = 'modules/home/homeHeaderTemplate.html';
});
