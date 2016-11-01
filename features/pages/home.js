const CONST = {
  promptTestDummyValue: 71,
};

module.exports = {
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Home');
      },
      doTest(feature) {
        this.click(`@test${feature}`);
      },
      doValidatePrompt() {
        this.api.page.prompt()
          .doChangeValue(CONST.promptTestDummyValue)
          .doOk();
      },
      expectAlertWithTestMessage() {
        this.api.page.prompt()
          .expectAlert('This is an alert');
      },
      expectConfirmWithTestMessage() {
        this.api.page.prompt()
          .expectConfirm('This is a confirm');
      },
      expectPromptWithTestMessage() {
        this.api.page.prompt()
          .expectPrompt('This is a prompt', 42);
      },
      expectToasterWithTestMessage() {
        this.api.page.toaster()
          .expectMessage('Ouuups1!');
      },
      expectToasterWithValidationMessage(type) {
        this.api.page.toaster()
          .expectMessage(`${type}-ok`);
      },
      expectToasterWithPromptValidationMessage() {
        this.api.page.toaster()
          .expectMessage(`prompt-ok, ${CONST.promptTestDummyValue}`);
      },
      expectToasterWithCancelationMessage(type) {
        this.api.page.toaster()
          .expectMessage(`${type}-cancel`);
      },
    },
  ],
  elements: {
    testAlert: {
      selector: '//*[contains(text(),\'Test Alert\')]',
      locateStrategy: 'xpath',
    },
    testConfirm: {
      selector: '//*[contains(text(),\'Test Confirm\')]',
      locateStrategy: 'xpath',
    },
    testPrompt: {
      selector: '//*[contains(text(),\'Test Prompt\')]',
      locateStrategy: 'xpath',
    },
    testToaster: {
      selector: '//*[contains(text(),\'Test Toaster\')]',
      locateStrategy: 'xpath',
    },
    testValidate: {
      selector: '//*[contains(text(),\'Validate\')]',
      locateStrategy: 'xpath',
    },
    testValidateArgs: {
      selector: '//*[contains(text(),\'ValidateArgs\')]',
      locateStrategy: 'xpath',
    },
  },
};
