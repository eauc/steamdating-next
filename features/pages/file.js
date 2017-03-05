const path = require('path');
const { createPage } = require('../helpers/page.js');

module.exports = createPage({
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('File');
        return this;
      },
      doOpen(filePath) {
        this.getAttribute(this.selector('openFileLabel'), 'for', (labelFor) => {
          const fileName = path.resolve(`${__dirname}/${filePath}`);
          this.setValue(this.selector('openFileInput', labelFor), fileName);
          this.api.page.prompt()
            .doOk();
        });
        return this;
      },
    },
  ],
  selectors: {
    openFileLabel: ['page', '//label[contains(string(.), "Open")]'],
    openFileInput: ['page', (labelFor) => `//input[@id="${labelFor.value}"]`],
  },
});
