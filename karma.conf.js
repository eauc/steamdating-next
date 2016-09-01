// Karma configuration
// Generated on Sun Jan 24 2016 12:26:07 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    plugins: [
      'karma-jspm',
      'karma-chrome-launcher',
      'karma-jasmine',
      'karma-jasmine-diff-reporter',
      'karma-jasmine-html-reporter'
    ],
    frameworks: [
      'jspm',
      'jasmine'
    ],


    // list of files / patterns to load in the browser
    files: [
    ],
    // This is bug in karma-jspm and it might be fix
    // in the future so we will not need to proxy anything
    // proxies: {
    //   'spec/': 'base/spec/',
    //   'app/': 'base/client/app/',
    //   'lib/': 'base/client/lib/'
    // },


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [
      'kjhtml',
      'jasmine-diff',
      'progress'
    ],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    jspm: {
      config: 'client/config.js',
      packages: 'client/lib/',
      loadFiles: [
        'spec/client/**/*Spec.js'
      ],
      serveFiles: [
        'spec/client/helpers/**/*.js',
        'client/app/**/*.+(js|html|css|json)'
      ],
      paths: {
        'spec/*': '/base/spec/*',
        'app/*': '/base/client/app/*',
        'github:*': '/base/client/lib/github/*',
        'npm:*': '/base/client/lib/npm/*'
      }
    }
  });
};
