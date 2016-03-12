'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.initConfig({
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [
                    'Logger.js',
                    'Configuration.js',
                    'ConfigurationStructure.js',
                    'Endpoint.js',
                    'GlobalConfiguration.js',
                    'MockupccinoServer.js',
                    'StaticContent.js',
                    'mockupccino.js'
                ],
                dest: 'mockupccino.temp.js'
            }
        },

        shell: {
            addheader: {
                command: "echo '#!/usr/bin/env node\\n' > mockupccino && cat mockupccino.temp1.js >> mockupccino",
                options: {
                    async: false
                }

            },

            finalclean: {
                command: 'rm *temp*.js && chmod +x mockupccino',
                options: {
                    async: false
                }
            }
        },

        uglify: {
            my_target: {
                files: {
                    'mockupccino.temp1.js': ['mockupccino.temp.js']
                }
            }
        }
    });

    grunt.registerTask('build', [
        'concat',
        'uglify',
        'shell:addheader',
        'shell:finalclean'
    ]);
}