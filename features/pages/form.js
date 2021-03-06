const R = require('ramda');

module.exports = {
  commands: [
    {
      doSetInputValue(inputSelector, value) {
        this.clearValue(inputSelector);
        R.forEach((key) => {
          this.setValue(inputSelector, key);
        }, R.splitEvery(1, `${value}`));
        return this;
      },
      doSetLabelInputValue(labelText, value) {
        this.getInputSelectorFor(
          labelText,
          (inputSelector) => this.doSetInputValue(inputSelector, value),
          { inputTag: ['input', 'textarea'] }
        );
        return this;
      },
      doSelectValue(labelText, valueText) {
        this.getInputSelectorFor(labelText, (inputSelector) => {
          const optionSelector = this.getOptionSelectorFor(
            inputSelector,
            valueText
          );
          this.getText(optionSelector, (text) => {
            this.setValue(inputSelector, text.value);
            this.setValue('//input[1]', '');
          });
        }, { inputTag: 'select' });
        return this;
      },
      doSelectMultipleValues(labelText, valuesTexts) {
        this.getInputSelectorFor(labelText, (inputSelector) => {
          R.forEach((valueText) => {
            const optionSelector = this.getOptionSelectorFor(
              inputSelector,
              valueText
            );
            this.click(optionSelector);
            this.api.keys(this.api.Keys.CONTROL);
          }, valuesTexts);
          this.setValue('//input[1]', '');
        }, { inputTag: 'select' });
        return this;
      },
      doSubmit() {
        this.click('@submitButton');
        return this;
      },
      expectInput(labelText, { value, inputTag = 'input' } = {}) {
        this.getInputSelectorFor(labelText, (inputSelector) => {
          this.expect.element(inputSelector)
            .to.be.visible;
          if (value) {
            const valueText = R.type(value) === 'Array' ? R.head(value) : value;
            this.expect.element(inputSelector)
              .to.have.value.that.deep.equals(valueText);
          }
        }, { inputTag });
        return this;
      },
      expectInputError(labelText, errorText) {
        this.getInputSelectorFor(labelText, (inputSelector) => {
          this.expect.element(inputSelector)
            .to.have.attribute('class').which.contains('error');
        }, { inputTag: ['input','textarea','select'] });
        this.expect.element(`//*[contains(@class, 'error') and contains(string(.), '${errorText}')]`)
          .to.be.visible;
        return this;
      },
      expectSubmitToBeEnabled() {
        this.expect.element('@submitButton')
          .not.to.have.attribute('class').which.contains('disabled');
        return this;
      },
      expectSubmitToBeDisabled() {
        this.expect.element('@submitButton')
          .to.have.attribute('class').which.contains('disabled');
        return this;
      },
      getInputSelectorFor(labelText, fn, { inputTag = 'input' } = {}) {
        const labelSelector = `//label[contains(string(.), "${labelText}")]`;
        this.getAttribute(labelSelector, 'for', (labelFor) => {
          const inputTagArray = R.type(inputTag) === 'Array' ? inputTag : [inputTag];
          const inputTagRefs = R.join(' or ', R.map((tag) => `self::${tag}`, inputTagArray));
          const inputSelector = `//*[${inputTagRefs}][@id="${labelFor.value}"]`;
          // console.log(inputSelector);
          fn(inputSelector);
        });
      },
      getOptionSelectorFor(inputSelector, valueText) {
        return `${inputSelector}/option[contains(string(.), "${valueText}")]`;
      },
    },
  ],
  elements: {
    submitButton: {
      selector: '//button[.//*[contains(@class, \'fa-check\')]]',
      locateStrategy: 'xpath',
    },
  },
};
