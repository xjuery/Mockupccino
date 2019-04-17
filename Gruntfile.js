module.exports = function (grunt) {
    grunt.initConfig({
        ts: {
            default: {
                tsconfig: './tsconfig.json'
            }
        },
        clean: {
            all: ['tmp', 'lib'],
            tmp: ['tmp']
        },
    });
    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks('grunt-contrib-clean');


    grunt.registerTask("build", ["clean:all", "ts", "clean:tmp"]);
};
