angular.module('circle.countdown', [])

.directive('countdown', ['$timeout', '$interval', function($timeout, $interval) {
    return {
        // scope: {}, // {} = isolate, true = child, false/undefined = no change
        scope: {
            time: '=time',
            finishCallback: '&callback',
        },
        restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
        template:   '<div class="ClassyCountdown-wrapper">' +
                        '<div class="ClassyCountdown-days">' +
                            '<input value="{{ knob.seconds.value }}"/>' +
                            '<span class="ClassyCountdown-value"><div></div><span></span></span>' +
                        '</div>' +
                        '<div class="ClassyCountdown-hours">' +
                            '<input value="{{ knob.seconds.value }}"/>' +
                            '<span class="ClassyCountdown-value"><div></div><span></span></span>' +
                        '</div>' +
                        '<div class="ClassyCountdown-minutes">' +
                            '<input value="{{ knob.seconds.value }}"/>' +
                            '<span class="ClassyCountdown-value"><div></div><span></span></span>' +
                        '</div>' +
                        '<div class="ClassyCountdown-seconds">' +
                            '<input value="{{ knob.seconds.value }}"/>' +
                            '<span class="ClassyCountdown-value"><div></div><span></span></span>' +
                        '</div>' +
                    '</div>',
        replace: false,
        controller: function($scope, $element, $attrs, $transclude) {
            
            var el = $($element); 

            var autostart = $attrs.autostart || 'true';

            $scope.knob = {
                days: {
                    value: 60,
                    options: {
                        max: 365,
                        // width: 75,
                        readOnly: true,
                        displayPrevious: true
                    }
                },
                hours: {
                    value: 60,
                    options: {
                        max: 24,
                        // width: 75,
                        readOnly: true,
                        displayPrevious: true
                    }
                },
                minutes: {
                    value: 60,
                    options: {
                        max: 60,
                        // width: 75,
                        readOnly: true,
                        displayPrevious: true
                    }
                },
                seconds: {
                    value: 60,
                    options: {
                        max: 60,
                        // width: 75,
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

            var defaults = {
                end: undefined,
                now: $.now(),
                labels: true,
                labelsOptions: {
                    lang: {
                        days: 'Days',
                        hours: 'Hours',
                        minutes: 'Minutes',
                        seconds: 'Seconds'
                    },
                    style: 'font-size: 0.5em;'
                },
                style: {
                    element: '',
                    labels: false,
                    textResponsive: 0.5,
                    days: {
                        gauge: {
                            thickness: 0.02,
                            bgColor: 'rgba(0, 0, 0, 0)',
                            fgColor: 'rgba(0, 0, 0, 1)',
                            lineCap: 'butt'
                        },
                        textCSS: ''
                    },
                    hours: {
                        gauge: {
                            thickness: 0.02,
                            bgColor: 'rgba(0, 0, 0, 0)',
                            fgColor: 'rgba(0, 0, 0, 1)',
                            lineCap: 'butt'
                        },
                        textCSS: ''
                    },
                    minutes: {
                        gauge: {
                            thickness: 0.02,
                            bgColor: 'rgba(0, 0, 0, 0)',
                            fgColor: 'rgba(0, 0, 0, 1)',
                            lineCap: 'butt'
                        },
                        textCSS: ''
                    },
                    seconds: {
                        gauge: {
                            thickness: 0.02,
                            bgColor: 'rgba(0, 0, 0, 0)',
                            fgColor: 'rgba(0, 0, 0, 1)',
                            lineCap: 'butt'
                        },
                        textCSS: ''
                    }
                },
                onEndCallback: function() {}
            };
            
            settings = defaults;

            angular.extend(settings, styles);
            
            angular.extend($scope.knob.days.options, styles.style.days.gauge);
            angular.extend($scope.knob.hours.options, styles.style.hours.gauge);
            angular.extend($scope.knob.minutes.options, styles.style.minutes.gauge);
            angular.extend($scope.knob.seconds.options, styles.style.seconds.gauge);

            var timerInterval;

            var DaysLeft, HoursLeft, MinutesLeft, SecondsLeft;
            var secondsLeft;
            var isFired = false;

            secondsLeft = parseInt($scope.time);

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

                el.find('.ClassyCountdown-days input').val(DaysLeft).change();
                el.find('.ClassyCountdown-hours input').val(HoursLeft).change();
                el.find('.ClassyCountdown-minutes input').val(MinutesLeft).change();
                el.find('.ClassyCountdown-seconds input').val(SecondsLeft).change();

                el.find('.ClassyCountdown-days .ClassyCountdown-value > div').html(DaysLeft);
                el.find('.ClassyCountdown-hours .ClassyCountdown-value > div').html(HoursLeft);
                el.find('.ClassyCountdown-minutes .ClassyCountdown-value > div').html(MinutesLeft);
                el.find('.ClassyCountdown-seconds .ClassyCountdown-value > div').html(SecondsLeft);

            }


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

                el.find('.ClassyCountdown-wrapper > div').attr("style", settings.style.element);
                el.find('.ClassyCountdown-days .ClassyCountdown-value').attr('style', settings.style.days.textCSS);
                el.find('.ClassyCountdown-hours .ClassyCountdown-value').attr('style', settings.style.hours.textCSS);
                el.find('.ClassyCountdown-minutes .ClassyCountdown-value').attr('style', settings.style.minutes.textCSS);
                el.find('.ClassyCountdown-seconds .ClassyCountdown-value').attr('style', settings.style.seconds.textCSS);
                el.find('.ClassyCountdown-value').each(function() {
                    $(this).css('margin-top', Math.floor(0 - (parseInt($(this).height()) / 2)) + 'px');
                });

                if (settings.labels) {
                    el.find(".ClassyCountdown-days .ClassyCountdown-value > span").html(settings.labelsOptions.lang.days);
                    el.find(".ClassyCountdown-hours .ClassyCountdown-value > span").html(settings.labelsOptions.lang.hours);
                    el.find(".ClassyCountdown-minutes .ClassyCountdown-value > span").html(settings.labelsOptions.lang.minutes);
                    el.find(".ClassyCountdown-seconds .ClassyCountdown-value > span").html(settings.labelsOptions.lang.seconds);
                    el.find(".ClassyCountdown-value > span").attr("style", settings.labelsOptions.style);
                }

                el.find('.ClassyCountdown-days .ClassyCountdown-value > div').html(DaysLeft);
                el.find('.ClassyCountdown-hours .ClassyCountdown-value > div').html(HoursLeft);
                el.find('.ClassyCountdown-minutes .ClassyCountdown-value > div').html(MinutesLeft);
                el.find('.ClassyCountdown-seconds .ClassyCountdown-value > div').html(SecondsLeft);

                el.find('.ClassyCountdown-days input').val(DaysLeft).change();
                el.find('.ClassyCountdown-hours input').val(HoursLeft).change();
                el.find('.ClassyCountdown-minutes input').val(MinutesLeft).change();
                el.find('.ClassyCountdown-seconds input').val(SecondsLeft).change();

                el.find('.ClassyCountdown-days input').val(DaysLeft).knob( angular.extend($scope.knob.days.options, {width: $('.ClassyCountdown-days').width()}) );
                el.find('.ClassyCountdown-hours input').val(HoursLeft).knob( angular.extend($scope.knob.hours.options, {width: $('.ClassyCountdown-hours').width()}) );
                el.find('.ClassyCountdown-minutes input').val(MinutesLeft).knob( angular.extend($scope.knob.minutes.options, {width: $('.ClassyCountdown-minutes').width()}) );
                el.find('.ClassyCountdown-seconds input').val(SecondsLeft).knob( angular.extend($scope.knob.seconds.options, {width: $('.ClassyCountdown-seconds').width()}) );
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

                el.find('.ClassyCountdown-days .ClassyCountdown-value > div').html(DaysLeft);
                el.find('.ClassyCountdown-hours .ClassyCountdown-value > div').html(HoursLeft);
                el.find('.ClassyCountdown-minutes .ClassyCountdown-value > div').html(MinutesLeft);
                el.find('.ClassyCountdown-seconds .ClassyCountdown-value > div').html(SecondsLeft);

                el.find('.ClassyCountdown-hours input').val(HoursLeft).change();
                el.find('.ClassyCountdown-minutes input').val(MinutesLeft).change();
                el.find('.ClassyCountdown-seconds input').val(SecondsLeft).change();
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
            doResponsive();

            if ($attrs.autostart == 'true')
            {
                $scope.start();
            }

            function doResponsive() {
                el.find('.ClassyCountdown-wrapper > div').each(function() {
                    $(this).css('height', $(this).width() + 'px');
                });
                if (settings.style.textResponsive) {
                    el.find('.ClassyCountdown-value').css('font-size', Math.floor(el.find('> div').eq(0).width() * settings.style.textResponsive / 10) + 'px');
                    el.find('.ClassyCountdown-value').each(function() {
                        $(this).css('margin-top', Math.floor(0 - (parseInt($(this).height()) / 2)) + 'px');
                    });
                }
                $(window).trigger('resize');
                // $(window).resize($.throttle(50, onResize));
                $(window).on('resize', onResize);
            }

            function onResize() {
                el.find('.ClassyCountdown-wrapper > div').each(function() {
                    $(this).css('height', $(this).width() + 'px');
                });
                if (settings.style.textResponsive) {
                    el.find('.ClassyCountdown-value').css('font-size', Math.floor(el.find('> div').eq(0).width() * settings.style.textResponsive / 10) + 'px');
                }
                el.find('.ClassyCountdown-value').each(function() {
                    $(this).css("margin-top", Math.floor(0 - (parseInt($(this).height()) / 2)) + 'px');
                });
                el.find('.ClassyCountdown-days input').trigger('change');
                el.find('.ClassyCountdown-hours input').trigger('change');
                el.find('.ClassyCountdown-minutes input').trigger('change');
                el.find('.ClassyCountdown-seconds input').trigger('change');

                el.find('.ClassyCountdown-days input').knob( {width: $('.ClassyCountdown-days').width()} );
                el.find('.ClassyCountdown-hours input').knob( {width: $('.ClassyCountdown-hours').width()} );
                el.find('.ClassyCountdown-minutes input').knob( {width: $('.ClassyCountdown-minutes').width()} );
                el.find('.ClassyCountdown-seconds input').knob( {width: $('.ClassyCountdown-seconds').width()} );

                $('.ClassyCountdown-days input').trigger('configure', {width:$('.ClassyCountdown-days').width()});
                $('.ClassyCountdown-hours input').trigger('configure', {width:$('.ClassyCountdown-hours').width()});
                $('.ClassyCountdown-minutes input').trigger('configure', {width:$('.ClassyCountdown-minutes').width()});
                $('.ClassyCountdown-seconds input').trigger('configure', {width:$('.ClassyCountdown-seconds').width()});

                // el.find('.ClassyCountdown-hours input').val(HoursLeft).knob( angular.extend($scope.knob.hours.options, {width: $('.ClassyCountdown-hours').width()}) );
                // el.find('.ClassyCountdown-minutes input').val(MinutesLeft).knob( angular.extend($scope.knob.minutes.options, {width: $('.ClassyCountdown-minutes').width()}) );
                // el.find('.ClassyCountdown-seconds input').val(SecondsLeft).knob( angular.extend($scope.knob.seconds.options, {width: $('.ClassyCountdown-seconds').width()}) );
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
