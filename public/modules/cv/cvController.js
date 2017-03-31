"use strict"
mainApp.controller("cvController", function($scope){
    $scope.certificates = [{
    	img: 'doc/img/angular.jpg',
    	link: 'doc/AngularJS certificate.pdf'
    },{
    	img: 'doc/img/upper.jpg',
    	link: 'doc/ENG_certificate_upper.pdf'
    },{
    	img: 'doc/img/intermediate.jpg',
    	link: 'doc/ENG certificate.pdf'
    },{
    	img: 'doc/img/softengi.jpg',
    	link: 'doc/ENG softengi.pdf'
    },{
    	img: 'doc/img/diplom.jpg',
    	link: 'doc/diplom_avard.pdf'
    }]
});
