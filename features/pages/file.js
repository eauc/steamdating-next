const path = require('path');

module.exports = {
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('File');
        return this;
      },
      doOpen(filePath) {
        const labelSelector = '//label[.//*[contains(text(), "Open")]]';
        this.getAttribute(labelSelector, 'for', (labelFor) => {
          const inputSelector = `//input[@id="${labelFor.value}"]`;
          const fileName = path.resolve(`${__dirname}/${filePath}`);
          this.setValue(inputSelector, fileName);
          this.api.page.prompt()
            .doOk();
        });
        return this;
      },
    },
  ],
  sections: {
    pageContent: {
      selector: '//*[contains(@class, \'sd-Page\')]',
      locateStrategy: 'xpath',
      elements: {},
    },
  },
};
