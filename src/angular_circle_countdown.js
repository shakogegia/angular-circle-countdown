angular.module('circle.countdown', [])

.directive('countdown', ['$timeout', '$interval', function($timeout, $interval) {
    return {
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        scope: {
            end: '=end',
            now: '=now',
            finishCallback: '&callback',
        },
        restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
        template: '<div class="countdown-wrapper">' +
            '<div class="countdown-hours">' +
            '<input value="{{ knob.seconds.value }}"/>' +
            '</div>' +
            '<div class="countdown-minutes">' +
            '<input value="{{ knob.seconds.value }}"/>' +
            '</div>' +
            '<div class="countdown-seconds">' +
            '<input value="{{ knob.seconds.value }}"/>' +
            '</div>' +
            '</div>',
        replace: false,
        controller: function($scope, $element, $attrs, $transclude) {

            var autostart = $attrs.autostart || 'true';

            $scope.knob = {
                hours: {
                    value: 60,
                    options: {
                        max: 60,
                        width: 75,
                        readOnly: true,
                        displayPrevious: true
                    }
                },
                minutes: {
                    value: 60,
                    options: {
                        max: 60,
                        width: 75,
                        readOnly: true,
                        displayPrevious: true
                    }
                },
                seconds: {
                    value: 60,
                    options: {
                        max: 60,
                        width: 75,
                        readOnly: true,
                        displayPrevious: true
                    }
                }
            };

            // flat-colors, flat-colors-wide, flat-colors-very-wide, 
            // flat-colors-black, black, black-wide, black-very-wide, 
            // black-black, white, white-wide, 
            // white-very-wide or white-black
            $scope.theme = $attrs.colors || 'white';
            var styles = getPreset($scope.theme);

            angular.extend($scope.knob.hours.options, styles.style.hours.gauge);
            angular.extend($scope.knob.minutes.options, styles.style.minutes.gauge);
            angular.extend($scope.knob.seconds.options, styles.style.seconds.gauge);

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

                $($element).find('.countdown-hours input').val(HoursLeft).change();
                $($element).find('.countdown-minutes input').val(MinutesLeft).change();
                $($element).find('.countdown-seconds input').val(SecondsLeft).change();

            }

            $($element).find('.countdown-hours input').val(HoursLeft).knob($scope.knob.hours.options);
            $($element).find('.countdown-minutes input').val(MinutesLeft).knob($scope.knob.minutes.options);
            $($element).find('.countdown-seconds input').val(SecondsLeft).knob($scope.knob.seconds.options);


            $scope.$on('timer-start', function() {
                $scope.doTick();
            });

            $scope.$on('timer-pause', function() {
                $scope.resume();
            });

            $scope.$on('timer-resume', function() {
                $scope.resume();
            });

            $scope.$on('timer-stop', function() {
                $scope.stop();
            });

            $scope.$on('timer-add-seconds', function(e, data) {
                $scope.addSeconds(data.seconds);
            });

            $scope.$on('timer-set-seconds', function(e, data) {
                $scope.setSeconds(data.seconds);
            });

            $scope.init = function()
            {
                $scope.secondsToDHMS();

                $($element).find('.countdown-hours input').val(HoursLeft).change();
                $($element).find('.countdown-minutes input').val(MinutesLeft).change();
                $($element).find('.countdown-seconds input').val(SecondsLeft).change();
            }


            $scope.start = function()
            {
                this.timerInterval = $interval(function() {
                    $scope.doTick();
                }, 1000);
            }

            $scope.pause = function()
            {
                $interval.cancel(this.timerInterval);
            }

            $scope.resume = function()
            {
                $scope.start();
            }

            $scope.stop = function()
            {
                secondsLeft = 0;
                
                $scope.secondsToDHMS();

                $($element).find('.countdown-hours input').val(HoursLeft).change();
                $($element).find('.countdown-minutes input').val(MinutesLeft).change();
                $($element).find('.countdown-seconds input').val(SecondsLeft).change();
            }

            $scope.addSeconds = function(seconds)
            {
                secondsLeft += seconds;
            }

            $scope.setSeconds = function(seconds)
            {
                secondsLeft = seconds;
            }

            $scope.init();

            if ($attrs.autostart == 'true')
            {
                $scope.start();
            }

            function getPreset(theme) {
                switch (theme) {
                    case 'flat-colors':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.01,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#1abc9c"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.01,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#2980b9"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.01,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#8e44ad"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.01,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#f39c12"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                }
                            }
                        };
                    case 'flat-colors-wide':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#1abc9c"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#2980b9"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#8e44ad"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#f39c12"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                }
                            }
                        };
                    case 'flat-colors-very-wide':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.12,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#1abc9c"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.12,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#2980b9"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.12,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#8e44ad"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.12,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#f39c12"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                }
                            }
                        };
                    case 'flat-colors-black':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#1abc9c",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#2980b9",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#8e44ad",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#f39c12",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                }
                            }
                        };
                    case 'black':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.01,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.01,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.01,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.01,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                }
                            }
                        };
                    case 'black-wide':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                }
                            }
                        };
                    case 'black-very-wide':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.17,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.17,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.17,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.17,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                }
                            }
                        };
                    case 'black-black':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(0,0,0,0.05)",
                                        fgColor: "#222",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#34495e;'
                                }
                            }
                        };
                    case 'white':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.03,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                }
                            }
                        };
                    case 'white-wide':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.06,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.06,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.06,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.06,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                }
                            }
                        };
                    case 'white-very-wide':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.16,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.16,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.16,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.16,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff"
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                }
                            }
                        };
                    case 'white-black':
                        return {
                            labels: true,
                            style: {
                                element: '',
                                textResponsive: 0.5,
                                days: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                hours: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                minutes: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                },
                                seconds: {
                                    gauge: {
                                        thickness: 0.25,
                                        bgColor: "rgba(255,255,255,0.05)",
                                        fgColor: "#fff",
                                        lineCap: 'round'
                                    },
                                    textCSS: 'font-family:\'Open Sans\';font-weight:300;color:#fff;'
                                }
                            }
                        };
                }
            }

        }
    };
}]);
