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
            replace: {
                command: 'cat mockupccino.temp.js | sed -e \"s/.*require(\\"\\.\\/.*/ /g\" > mockupccino.temp2.js',
                options: {
                    async: false
                }
            },
            addheader: {
                command: "echo '#!/usr/bin/env node\\n' > mockupccino && cat mockupccino.temp3.js >> mockupccino",
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
                    'mockupccino.temp3.js': ['mockupccino.temp2.js']
                }
            }
        }
    });

    grunt.registerTask('build', [
        'concat',
        'shell:replace',
        'uglify',
        'shell:addheader',
        'shell:finalclean'
    ]);
}