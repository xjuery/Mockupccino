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
                    'src/Configuration.js',
                    'src/ConfigurationStructure.js',
                    'src/Endpoint.js',
                    'src/GlobalConfiguration.js',
                    'src/Logger.js',
                    'src/MockupccinoServer.js',
                    'src/StaticContent.js',
                    'src/mockupccino.js'
                ],
                dest: 'bin/mockupccino.temp.js'
            }
        },

        uglify: {
            my_target: {
                files: {
                    'bin/mockupccino.temp3.js': ['bin/mockupccino.temp2.js']
                }
            }
        },

        shell: {
            cleanrequired: {
                command: 'cat bin/mockupccino.temp.js | sed -e \"s/.*require(\\"\\.\\/.*/ /g\" > bin/mockupccino.temp2.js',
                options: {
                    async: false
                }
            },

            addheader: {
                command: "echo '#!/usr/bin/env node\\n' > bin/mockupccino && cat bin/mockupccino.temp3.js >> bin/mockupccino",
                options: {
                    async: false
                }
            },

            finalclean: {
                command: 'rm bin/*temp*.js && chmod +x bin/mockupccino',
                options: {
                    async: false
                }
            }
        }
    });

    grunt.registerTask('build', [
        'concat',
        'shell:cleanrequired',
        'uglify',
        'shell:addheader',
        'shell:finalclean'
    ]);
}