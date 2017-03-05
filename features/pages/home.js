const { createPage } = require('../helpers/page.js');

const CONST = {
  promptTestDummyValue: 71,
};

module.exports = createPage({
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Home');
        return this;
      },
      doTest(feature) {
        this.api
          .click(this.selector('testMenu', feature));
        return this;
      },
      doValidatePrompt() {
        this.api.page.prompt()
          .doChangeValue(CONST.promptTestDummyValue)
          .doOk();
        return this;
      },
      expectAlertWithTestMessage() {
        this.api.page.prompt()
          .expectAlert('This is an alert');
        return this;
      },
      expectConfirmWithTestMessage() {
        this.api.page.prompt()
          .expectConfirm('This is a confirm');
        return this;
      },
      expectPromptWithTestMessage() {
        this.api.page.prompt()
          .expectPrompt('This is a prompt', 42);
        return this;
      },
      expectToasterWithTestMessage() {
        this.api.page.toaster()
          .expectMessage('Ouuups1!');
        return this;
      },
      expectToasterWithValidationMessage(type) {
        this.api.page.toaster()
          .expectMessage(`${type}-ok`);
        return this;
      },
      expectToasterWithPromptValidationMessage() {
        this.api.page.toaster()
          .expectMessage(`prompt-ok, ${CONST.promptTestDummyValue}`);
        return this;
      },
      expectToasterWithCancelationMessage(type) {
        this.api.page.toaster()
          .expectMessage(`${type}-cancel`);
        return this;
      },
    },
  ],
  selectors: {
    testMenu: ['menu', function (feature) { return this.elements[`test${feature}`].selector; }],
  },
  elements: {
    testAlert: {
      selector: '//*[contains(text(),\'Test Alert\')]',
    },
    testConfirm: {
      selector: '//*[contains(text(),\'Test Confirm\')]',
    },
    testPrompt: {
      selector: '//*[contains(text(),\'Test Prompt\')]',
    },
    testToaster: {
      selector: '//*[contains(text(),\'Test Toaster\')]',
    },
    testValidate: {
      selector: '//*[contains(text(),\'Validate\')]',
    },
    testValidateArgs: {
      selector: '//*[contains(text(),\'ValidateArgs\')]',
    },
  },
});
