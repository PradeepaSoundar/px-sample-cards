'use strict';


module.exports = function(grunt) {

  var importOnce = require('node-sass-import-once');
  // Project configuration.
  grunt.initConfig({

    clean: {
      css: ['css'],
      bower: ['bower_components'],
      reports: ['reports']
    },

    sass: {
      options: {
        sourceMap: false, //no source maps b/c web-components inline css anyway...
        importer: importOnce,
        importOnce: {
          index: true,
          bower: true
        },
        /*
         See https://github.com/PredixDev/px-getting-started#a-note-about-relative-import-paths for an explanation
         of the contents of the includePaths option for Sass
         */
        includePaths: ['bower_components/*']
      },
      dist: {
        files: {
          'css/noprefix/px-sample-cards.css': 'sass/px-sample-cards-predix.scss',
          'css/noprefix/widgets-card.css': 'sass/widgets-card-predix.scss',
          'css/noprefix/px-sample-cards-demo.css': 'sass/px-sample-cards-demo.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 version']
      },
      multiple_files: {
        expand: true,
        flatten: true,
        src: 'css/noprefix/*.css',
        dest: 'css'
      }
    },

    shell: {
      options: {
        stdout: true,
        stderr: true
      },
      bower: {
        command: 'bower install'
      }
    },

    jshint: {
      all: [
        'Gruntfile.js',
        'js/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      sass: {
        files: ['sass/**/*.scss'],
        tasks: ['sass', 'autoprefixer'],
        options: {
          interrupt: true
        }
      }
    },

    depserve: {
      options: {
        open: '<%= depserveOpenUrl %>'
      }
    },

    webdriver: {
      options: {
        specFiles: ['test/*spec.js']
      },
      local: {
        webdrivers: ['chrome']
      }
    },

    bump: {
      options:{
        files: ['bower.json', 'package.json'],
        updateConfigs: [],
        commitFiles: ['package.json', 'bower.json'],
        push: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-dep-serve');
  grunt.loadNpmTasks('grunt-autoprefixer');

  // Default task.
  grunt.registerTask('default', 'Basic build', [
    'sass',
    'autoprefixer'
  ]);

  // First run task.
  grunt.registerTask('firstrun', 'Basic first run', function() {
    grunt.config.set('depserveOpenUrl', '/index.html');
    grunt.task.run('default');
    grunt.task.run('depserve');
  });

  grunt.registerTask('release', 'Release', [
    'clean',
    'shell:bower',
    'default',
    'test'
  ]);

};
