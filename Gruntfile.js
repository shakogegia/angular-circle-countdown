module.exports = function(grunt) {
    grunt.initConfig({
        pkg: 'angular_circle_countdown',
        concat: {
            options: {
                separator: grunt.util.linefeed + ';' + grunt.util.linefeed
            },
            dist: {
                src: [ 'src/angular_circle_countdown.js'],
                dest: 'dist/angular_circle_countdown.js'
            }
        },
        uglify: {
            target: {
                files: {
                    'dist/angular_circle_countdown.min.js': [ 'src/angular_circle_countdown.js' ],
                    'dist/angular_circle_countdown.min.css': [ 'src/angular_circle_countdown.css' ]
                }
            }
        },
        watch: {
            js: {
                files: [ 'src/*.js' ],
                tasks: [ 'concat' ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['concat', 'uglify']);
};
