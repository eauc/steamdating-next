// require('babel-core/register');
require('nightwatch-cucumber')({
  featureFiles: ['features'],
  stepDefinitions: ['features/step_definitions'],
  supportFiles: [],
  jsonReport: 'features/reports/cucumber.json',
  htmlReport: 'features/reports/cucumber.html',
  openReport: false,
  stepTimeout: 30000,
});

module.exports = (function (settings) {
  return settings;
})(require('./nightwatch.json'));
