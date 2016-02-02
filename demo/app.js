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

    
    $scope.knobData = [
		{
			value: 30,
			options: {
				width: 100,
				displayInput: false
			}
		},
		{
			value: 40,
			options: {
				readOnly: true,
				width: 145,
		        height: 145
			}
		},
		{
			value: 20,
			options: {
				width: 150,
				cursor: true,
				thickness: .3,
				fgColor: '#222222'
			}
		},
		{
			value: 70,
			options: {
				fgColor: '#66CC66',
				angleOffset: -125,
				angleArc: 250
			}
		},
		{
			value: 90,
			options: {
				angleOffset: 90,
				linecap: 'round'
			}
		},
		{
			value: 10,
			options: {
				width: 75,
			    fgColor: "#ffec03",
			    skin: "tron",
			    thickness: .2,
			    displayPrevious: true
			}
		},
		{
			value: 80,
			options: {
				displayPrevious: true,
				min: -100	
			}
		}
	];

    $scope.data = 20;
    $scope.options = {
        width: 75,
        fgColor: "#ffec03",
        skin: "tron",
        thickness: 0.2,
        displayPrevious: true
    }

	$scope.formatOptions = function(data) {
		data.options.max = 60;
		data.options.width = 60;
		data.options.thickness = 0.1;
		// data.options.readOnly = true;
		data.formattedOptions = JSON.stringify(data.options).replace(/,/g,"\n");
		return data;
	};

}])