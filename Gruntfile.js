'use strict';

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-contrib-uglify');

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
                    'mockupccino.js',
                    'MockupccinoServer.js',
                    'StaticContent.js'
                ],
                dest: 'build/mockupccino.temp.js'
            }
        },

        shell: {
            replace: {
                command: 'cat build/mockupccino.temp.js | sed -e \"s/.*require(\\"\\.\\/.*/ /g\" > build/mockupccino.temp2.js',
                options: {
                    async: false
                }
            },
            addheader: {
                command: "echo '#!/usr/bin/env node\\n' > build/mockupccino && cat build/mockupccino.temp3.js >> build/mockupccino",
                options: {
                    async: false
                }

            },

            finalclean: {
                command: 'rm build/*temp* && chmod +x build/mockupccino',
                options: {
                    async: false
                }
            },

            firstclean: {
                command: 'rm -fr build && mkdir build',
                options: {
                    async: false
                }
            }
        },

        uglify: {
            my_target: {
                files: {
                    'build/mockupccino.temp3.js': ['build/mockupccino.temp2.js']
                }
            }
        }
    });

    grunt.registerTask('build', [
        'shell:firstclean',
        'concat',
        'shell:replace',
        'uglify',
        'shell:addheader',
        'shell:finalclean'
    ]);
}