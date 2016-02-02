angular.module('circle.countdown', [])

.directive('countdown',  ['$timeout', '$interval', function($timeout, $interval) {
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        scope: {
            colors: '=?colors',
            autostart: '=?autostart',
            hours: '=?hours',
            minutes: '=?minutes',
            seconds: '=?seconds',
            time: '=?time',
            finishCallback: '&finishCallback',
        }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<input value="{{ time }}"/><input value="{{ progress }}"/>',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        controller: function($scope, $element, $attrs, $transclude) {
        // link: function($scope, iElm, iAttrs, controller) {

            $scope._startTime = $scope.time;

            var timerInterval; 

            if (angular.isUndefined($scope.colors)) {
                $scope.colors = {
                    hours: "green",
                    minutes: "green",
                    seconds: "green",
                }
            }

            if (angular.isUndefined($scope.autostart)) {
                $scope.autostart = true;
            }


            $scope._start = function() {
                
                this.timerInterval = $interval( function() {
                    if ($scope.time <= 0) {
                        $scope._finished();
                    };
                    console.log( $scope.time-- );

                    $scope.progress = ($scope.time) / $scope._startTime * 100;

                }, 1000);

            };

            $scope._finished = function() {
                $interval.cancel(this.timerInterval);

                if($scope.finishCallback) {
                    $scope.$eval($scope.finishCallback);
                }
            };

            if ($scope.autostart)
                $scope._start();

            $scope.$on('countdown-start', function () {
                $scope._start();
            });
            
        }
    };
}]);