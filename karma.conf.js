module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine-jquery', 'jasmine', 'angular-cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-jquery'),
      require('karma-chrome-launcher'),
      require('karma-remap-istanbul'),
      require('karma-mocha-reporter'),
      require('angular-cli/plugins/karma')
    ],
    files: [
      { pattern: './src/test.ts', watched: false }
    ],
    preprocessors: {
      './src/test.ts': ['angular-cli']
    },
    remapIstanbulReporter: {
      reports: {
        html: 'coverage',
        lcovonly: './coverage/coverage.lcov'
      }
    },
    angularCli: {
      config: './angular-cli.json',
      environment: 'dev'
    },
    reporters: [
      'mocha', 'karma-remap-istanbul'
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    mime: { 'text/x-typescript': ['ts', 'tsx'] } // https://github.com/lathonez/clicker/issues/178
  });
};