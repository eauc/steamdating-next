const { createPage } = require('../helpers/page.js');

module.exports = createPage({
  commands: [
    {
      visitPage(page) {
        this.api
          .url(this.api.launchUrl)
          .click(this.selector('pageNav', page));
        return this;
      },
    },
  ],
  selectors: {
    pageNav: ['nav', (page) => `//*[contains(text(),'${page}')]`],
  },
});
