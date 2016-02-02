/// <reference path="../../typings/angularjs/angular.d.ts"/>

var app = angular.module('App', ['ui.knob', 'circle.countdown']);

app.controller('AppController', ['$scope', function($scope){
    
    $scope.countdownColors = {
        hours: "red",
        minutes: "red",
        seconds: "red",
    };

    $scope.finished = function() {
        alert();
    }

    

}])