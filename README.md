# Angular circle countdown
Circle countdown for angular

## See demo
[Demo](http://shakogegia.github.io/angular-circle-countdown/)

## Install 
with bower
```
$ bower install angular-circle-countdown --save
```

## Include
include files
```html
<link rel="stylesheet" href="bower_components/dist/angular_circle_countdown.css">
<script src="bower_components/dist/angular_circle_countdown.js"></script>
```

## Usage

Inlucde in your app

```js
var app = angular.module('App', ['circle.countdown']);

app.controller('AppController', ['$scope', function($scope){
  
    $scope.finished = function(){
        // Finish callback
    };
    
}])
```

Insert in your html

```html
<countdown now="0" end="100" finish-callback="finished()"></countdown>
```
