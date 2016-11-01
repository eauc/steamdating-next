const CONST = {
  promptTestDummyValue: 71,
};

module.exports = {
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Home');
        return this;
      },
      doTest(feature) {
        this.section.pageContent
          .click(`@test${feature}`);
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
  sections: {
    pageContent: {
      selector: '//*[contains(@class, \'sd-Page\')]',
      locateStrategy: 'xpath',
      elements: {
        testAlert: {
          selector: './/*[contains(text(),\'Test Alert\')]',
          locateStrategy: 'xpath',
        },
        testConfirm: {
          selector: './/*[contains(text(),\'Test Confirm\')]',
          locateStrategy: 'xpath',
        },
        testPrompt: {
          selector: './/*[contains(text(),\'Test Prompt\')]',
          locateStrategy: 'xpath',
        },
        testToaster: {
          selector: './/*[contains(text(),\'Test Toaster\')]',
          locateStrategy: 'xpath',
        },
        testValidate: {
          selector: './/*[contains(text(),\'Validate\')]',
          locateStrategy: 'xpath',
        },
        testValidateArgs: {
          selector: './/*[contains(text(),\'ValidateArgs\')]',
          locateStrategy: 'xpath',
        },
      },
    },
  },
};
