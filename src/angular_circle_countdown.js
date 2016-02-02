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
            end: '=?end',
            now: '=?now',
            finishCallback: '&finishCallback',
        }, // {} = isolate, true = child, false/undefined = no change
        // controller: function($scope, $element, $attrs, $transclude) {},
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<knob max="60" knob-data="data" konb-options="options"></knob>',
        // templateUrl: '',
        // replace: true,
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        controller: function($scope, $element, $attrs, $transclude) {
        // link: function($scope, iElm, iAttrs, controller) {

            var timerInterval;

            var DaysLeft, HoursLeft, MinutesLeft, SecondsLeft;
            var secondsLeft;
            var isFired = false;

            secondsLeft = $scope.end - $scope.now;

            $scope.secondsToDHMS = function() {
                DaysLeft = Math.floor(secondsLeft / 86400);
                HoursLeft = Math.floor((secondsLeft % 86400) / 3600);
                MinutesLeft = Math.floor(((secondsLeft % 86400) % 3600) / 60);
                SecondsLeft = Math.floor((((secondsLeft % 86400) % 3600) % 60) % 60);
            }

            $scope.doTick = function() {
                secondsLeft--;
                $scope.secondsToDHMS();
                if (secondsLeft <= 0) {
                    if (!isFired) {
                        isFired = true;
                        $scope.$eval($scope.finishCallback);
                    }
                    DaysLeft = 0;
                    HoursLeft = 0;
                    MinutesLeft = 0;
                    SecondsLeft = 0;
                }
                
                // element.find('.ClassyCountdown-days input').val(365 - DaysLeft).trigger('change');
                // element.find('.ClassyCountdown-hours input').val(24 - HoursLeft).trigger('change');
                // element.find('.ClassyCountdown-minutes input').val(60 - MinutesLeft).trigger('change');
                // element.find('.ClassyCountdown-seconds input').val(60 - SecondsLeft).trigger('change');
                // element.find('.ClassyCountdown-days .ClassyCountdown-value > div').html(DaysLeft);
                // element.find('.ClassyCountdown-hours .ClassyCountdown-value > div').html(HoursLeft);
                // element.find('.ClassyCountdown-minutes .ClassyCountdown-value > div').html(MinutesLeft);
                // element.find('.ClassyCountdown-seconds .ClassyCountdown-value > div').html(SecondsLeft);

                $scope.data = 60 - SecondsLeft;
            }

            $scope.doTick();

            this.timerInterval = $interval( function() {
                $scope.doTick();
            }, 1000);

            // function doResponsive() {
            //     element.find('.ClassyCountdown-wrapper > div').each(function() {
            //         $(this).css('height', $(this).width() + 'px');
            //     });
            //     if (settings.style.textResponsive) {
            //         element.find('.ClassyCountdown-value').css('font-size', Math.floor(element.find('> div').eq(0).width() * settings.style.textResponsive / 10) + 'px');
            //         element.find('.ClassyCountdown-value').each(function() {
            //             $(this).css('margin-top', Math.floor(0 - (parseInt($(this).height()) / 2)) + 'px');
            //         });
            //     }
            //     $(window).trigger('resize');
            //     $(window).resize($.throttle(50, onResize));
            // }

            // function onResize() {
            //     element.find('.ClassyCountdown-wrapper > div').each(function() {
            //         $(this).css('height', $(this).width() + 'px');
            //     });
            //     if (settings.style.textResponsive) {
            //         element.find('.ClassyCountdown-value').css('font-size', Math.floor(element.find('> div').eq(0).width() * settings.style.textResponsive / 10) + 'px');
            //     }
            //     element.find('.ClassyCountdown-value').each(function() {
            //         $(this).css("margin-top", Math.floor(0 - (parseInt($(this).height()) / 2)) + 'px');
            //     });
            //     element.find('.ClassyCountdown-days input').trigger('change');
            //     element.find('.ClassyCountdown-hours input').trigger('change');
            //     element.find('.ClassyCountdown-minutes input').trigger('change');
            //     element.find('.ClassyCountdown-seconds input').trigger('change');
            // }


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
                max: 60,
                width: 75,
                fgColor: "#ffec03",
                skin: "tron",
                thickness: .1,
                displayPrevious: true
            }
            // ----
        }
    };
}]);