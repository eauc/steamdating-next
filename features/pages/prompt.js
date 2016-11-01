const R = require('ramda');

module.exports = {
  commands: [
    {
      doCancel() {
        this.section.prompt
          .click('@cancelButton');
      },
      doChangeValue(value) {
        this.section.prompt
          .clearValue('@input');
        R.forEach((key) => {
          this.section.prompt
            .setValue('@input', key);
        }, R.splitEvery(1, `${value}`));
        this.section.prompt
          .expect.element('@input').value.to.equal(value);
        return this;
      },
      doOk() {
        this.section.prompt
          .click('@okButton');
      },
      expectAlert(message) {
        this.expect.section('@prompt')
          .text.to.contain(message);
        this.section.prompt
          .expect.element('@okButton').to.be.visible;
        this.section.prompt
          .expect.element('@cancelButton').not.to.be.visible;
      },
      expectConfirm(message) {
        this.expect.section('@prompt')
          .text.to.contain(message);
        this.section.prompt
          .expect.element('@okButton').to.be.visible;
        this.section.prompt
          .expect.element('@cancelButton').to.be.present;
      },
      expectPrompt(message, value) {
        this.expect.section('@prompt')
          .text.to.contain(message);
        this.section.prompt
          .expect.element('@input').value.to.equal(value);
        this.section.prompt
          .expect.element('@okButton').to.be.visible;
        this.section.prompt
          .expect.element('@cancelButton').to.be.present;
      },
      expectNoPresent() {
        this.expect.section('@prompt')
          .not.to.be.visible;
      },
    },
  ],
  sections: {
    prompt: {
      selector: '.sd-Prompt',
      elements: {
        input: {
          selector: 'input',
          locateStrategy: 'tag name',
        },
        okButton: {
          selector: '//button[contains(text(), \'Ok\')]',
          locateStrategy: 'xpath',
        },
        cancelButton: {
          selector: '//button[contains(text(), \'No\')]',
          locateStrategy: 'xpath',
        },
      },
    },
  },
};
