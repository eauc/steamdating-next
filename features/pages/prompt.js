const R = require('ramda');

module.exports = {
  commands: [
    {
      doCancel() {
        this.section.prompt
          .click('@cancelButton');
        return this;
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
        return this;
      },
      expectAlert(message) {
        this.expect.section('@prompt')
          .text.to.contain(message);
        this.section.prompt
          .expect.element('@okButton').to.be.visible;
        this.section.prompt
          .expect.element('@cancelButton').not.to.be.visible;
        return this;
      },
      expectConfirm(message) {
        this.expect.section('@prompt')
          .text.to.contain(message);
        this.section.prompt
          .expect.element('@okButton').to.be.visible;
        this.section.prompt
          .expect.element('@cancelButton').to.be.present;
        return this;
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
        return this;
      },
      expectNoPresent() {
        this.expect.section('@prompt')
          .not.to.be.visible;
        return this;
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
          selector: './/button[contains(string(.), \'Ok\')]',
          locateStrategy: 'xpath',
        },
        cancelButton: {
          selector: './/button[contains(string(.), \'No\')]',
          locateStrategy: 'xpath',
        },
      },
    },
  },
};
