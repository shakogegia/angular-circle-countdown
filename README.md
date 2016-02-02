## Include
include files
```
<link rel="stylesheet" href="bower_components/dist/angular_circle_countdown.css">
<script src="bower_components/dist/angular_circle_countdown.js"></script>
```

## Usage

Inlucde in your app

```
var app = angular.module('App', ['circle.countdown']);

app.controller('AppController', ['$scope', function($scope){
  
    $scope.finished = function(){
        // Finish callback
    };
    
}])
```

Insert in your html

```
<countdown now="0" end="100" finish-callback="finished()"></countdown>
```
