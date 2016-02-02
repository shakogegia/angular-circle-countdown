angular.module('ui.knob', []).directive('knob', ['$timeout', function($timeout) {
    'use strict';

    return {
        restrict: 'EA',
        replace: true,
        template: '<input value="{{ knobData }}"/>',
        scope: {
            knobData: '=',
            knobOptions: '&'
        },
        link: function($scope, iElm, iAttrs, controller) {
            var knobInit = $scope.knobOptions() || {};

            knobInit.release = function(newValue) {
                $timeout(function() {
                    $scope.knobData = newValue;
                    $scope.$apply();
                });
            };

            $scope.$watch('knobData', function(newValue, oldValue) {
                if (newValue != oldValue) {
                    $(iElm).val(newValue).change();
                }
            });

            $(iElm).val($scope.knobData).knob(knobInit);
        }
    };
}]);