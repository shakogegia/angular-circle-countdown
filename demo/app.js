/// <reference path="../../typings/angularjs/angular.d.ts"/>

var app = angular.module('App', ['circle.countdown']);

app.controller('AppController', ['$scope', function($scope){
    
 	$scope.addSeconds = function (){
        $scope.$broadcast('timer-add-seconds', { seconds: 90000 });
    };

    $scope.finished = function() {
        alert();
    }

    

}])