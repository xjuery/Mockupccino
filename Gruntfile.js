'use strict';

module.exports = function (grunt) {
    // grunt.loadNpmTasks('grunt-contrib-concat');
    // grunt.loadNpmTasks('grunt-shell-spawn');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-typescript');

    grunt.initConfig({
        // concat: {
        //     options: {
        //         separator: '\n'
        //     },
        //     dist: {
        //         src: [
        //             'src/Configuration.js',
        //             'src/ConfigurationStructure.js',
        //             'src/Endpoint.js',
        //             'src/GlobalConfiguration.js',
        //             'src/Logger.js',
        //             'src/InternalServer.js',
        //             'src/ConfigCreator.js',
        //             'src/StaticContent.js',
        //             'src/Mockupccino.js'
        //         ],
        //         dest: 'bin/mockupccino.temp.js'
        //     }
        // },
        //
        // uglify: {
        //     my_target: {
        //         files: {
        //             'bin/mockupccino.temp3.js': ['bin/mockupccino.temp2.js']
        //         }
        //     }
        // },
        //
        // shell: {
        //     cleanrequired: {
        //         command: 'cat bin/mockupccino.temp.js | sed -e \"s/.*require(\\"\\.\\/.*/ /g\" > bin/mockupccino.temp2.js',
        //         options: {
        //             async: false
        //         }
        //     },
        //
        //     addheader: {
        //         command: "echo '#!/usr/bin/env node\\n' > bin/mockupccino && cat bin/mockupccino.temp3.js >> bin/mockupccino",
        //         options: {
        //             async: false
        //         }
        //     },
        //
        //     finalclean: {
        //         command: 'rm bin/*temp*.js && chmod +x bin/mockupccino',
        //         options: {
        //             async: false
        //         }
        //     }
        // },

        uglify: {
            dist: {
                /*options: {
                    sourceMap: './bin/mockupccino.map',
                    sourceMapRoot: './src/'
                },*/
                files: {
                    './bin/mockupccino.js': [
                        'src/Configuration.js',
                        'src/ConfigurationStructure.js',
                        'src/Endpoint.js',
                        'src/GlobalConfiguration.js',
                        'src/Logger.js',
                        'src/InternalServer.js',
                        'src/ConfigCreator.js',
                        'src/StaticContent.js',
                        'src/Mockupccino.js'
                    ]
                }
            }
        },
        typescript: {
            base: {
                src: ['**/*.ts'],
                dest: './bin'/*,
                options: {
                    module: 'commonjs',
                    sourcemap: true,
                    declaration: false
                }*/
            }

        }
    });

    // grunt.registerTask('build', [
    //     'concat',
    //     'shell:cleanrequired',
    //     'uglify',
    //     'shell:addheader',
    //     'shell:finalclean'
    // ]);

    grunt.registerTask('build', ['uglify:dist']);
}