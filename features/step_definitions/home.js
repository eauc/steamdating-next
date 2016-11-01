module.exports = function () {
  this.Given('I open Home page', function () {
    this.currentPage = this.page.home()
      .visit();
  });

  this.When('I test the "$feature"', function (feature) {
    this.currentPage.doTest(feature);
  });

  this.When('I validate the "$feature"', function (_feature_) {
    this.page.prompt().doOk();
  });

  this.When('I change the value and I validate the Prompt', function () {
    this.currentPage.doValidatePrompt();
  });

  this.When('I cancel the "$feature"', function (_feature_) {
    this.page.prompt().doCancel();
  });

  this.Then('the "$feature" appears with a test message', function (feature) {
    this.currentPage[`expect${feature}WithTestMessage`]();
  });

  this.Then('the Prompt appears with a test message and a test value', function () {
    this.currentPage.expectPromptWithTestMessage();
  });

  this.Then('the Toaster appears with "$message" message', function (message) {
    this.page.toaster().expectMessage(message);
  });

  this.Then('the Toaster appears with the "$type" validation message', function (type) {
    this.currentPage.expectToasterWithValidationMessage(type.toLowerCase());
  });

  this.Then('the Toaster appears with the Prompt validation message and new value', function () {
    this.currentPage.expectToasterWithPromptValidationMessage();
  });

  this.Then('the Toaster appears with the "$type" cancelation message', function (type) {
    this.currentPage.expectToasterWithCancelationMessage(type.toLowerCase());
  });

  this.Then('the "$feature" disappears', function (_feature_) {
    this.page.prompt().expectNoPresent();
  });
};
