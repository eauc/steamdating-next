module.exports = function () {
  this.Given(/^I open Home page$/, function () {
    this.currentPage = this.page.home();
    this.currentPage.visit();
  });

  this.When(/^I test the "([^"]*)"$/, function (feature) {
    this.currentPage.doTest(feature);
  });

  this.When(/^I validate the "([^"]*)"$/, function (_feature_) {
    this.page.prompt().doOk();
  });

  this.When(/^I change the value and I validate the Prompt$/, function () {
    this.currentPage.doValidatePrompt();
  });

  this.When(/^I cancel the "([^"]*)"$/, function (_feature_) {
    this.page.prompt().doCancel();
  });

  this.Then(/^the "([^"]*)" appears with a test message$/, function (feature) {
    this.currentPage[`expect${feature}WithTestMessage`]();
  });

  this.Then(/^the Prompt appears with a test message and a test value$/, function () {
    this.currentPage.expectPromptWithTestMessage();
  });

  this.Then(/^the Toaster appears with "([^"]*)" message$/, function (message) {
    this.page.toaster().expectMessage(message);
  });

  this.Then(/^the Toaster appears with the "([^"]*)" validation message$/, function (type) {
    this.currentPage.expectToasterWithValidationMessage(type.toLowerCase());
  });

  this.Then(/^the Toaster appears with the Prompt validation message and new value$/, function () {
    this.currentPage.expectToasterWithPromptValidationMessage();
  });

  this.Then(/^the Toaster appears with the "([^"]*)" cancelation message$/, function (type) {
    this.currentPage.expectToasterWithCancelationMessage(type.toLowerCase());
  });

  this.Then(/^the "([^"]*)" disappears$/, function (_feature_) {
    this.page.prompt().expectNoPresent();
  });
};
