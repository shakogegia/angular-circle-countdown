angular.module('circle.countdown', [])

.directive('countdown',  ['$timeout', '$interval', function($timeout, $interval) {
    return {
        scope: {
            colors: '=?colors',
            autostart: '=?autostart',
            end: '=end',
            now: '=now',
            finishCallback: '&finishCallback',
        },
        restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="countdown-wrapper">' +
                        '<div class="countdown-hours">' +
                            '<input id="countdown-hours" value="{{ knob.seconds.value }}"/>'+
                        '</div>' +
                        '<div class="countdown-minutes">' +
                            '<input id="countdown-minutes" value="{{ knob.seconds.value }}"/>'+
                        '</div>' +
                        '<div class="countdown-seconds">' +
                            '<input id="countdown-seconds" value="{{ knob.seconds.value }}"/>'+
                        '</div>' +
                    '</div>',
        replace: false,
        controller: function($scope, $element, $attrs, $transclude) {

            $scope.knob = {
                hours: {
                    value: 60,
                    options: {
                        max: 60,
                        width: 75,
                        fgColor: "#000",
                        skin: "tron",
                        thickness: 0.1,
                        readOnly: true,
                        displayPrevious: true
                    }
                },
                minutes: {
                    value: 60,
                    options: {
                        max: 60,
                        width: 75,
                        fgColor: "#ff3300",
                        skin: "tron",
                        thickness: 0.1,
                        readOnly: true,
                        displayPrevious: true
                    }
                },
                seconds: {
                    value: 60,
                    options: {
                        max: 60,
                        width: 75,
                        fgColor: "#ffec03",
                        skin: "tron",
                        thickness: 0.1,
                        readOnly: true,
                        displayPrevious: true
                    }
                }
            };

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
                        $interval.cancel(this.timerInterval);
                    }
                    DaysLeft = 0;
                    HoursLeft = 0;
                    MinutesLeft = 0;
                    SecondsLeft = 0;
                }

                $('#countdown-hours').val(HoursLeft).change();
                $('#countdown-minutes').val(MinutesLeft).change();
                $('#countdown-seconds').val(SecondsLeft).change();
                
            }

            $('#countdown-hours').val(HoursLeft).knob($scope.knob.hours.options);
            $('#countdown-minutes').val(MinutesLeft).knob($scope.knob.minutes.options);
            $('#countdown-seconds').val(SecondsLeft).knob($scope.knob.seconds.options);
            
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

        }
    };
}]);