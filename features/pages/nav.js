module.exports = {
  commands: [
    {
      visitPage(page) {
        this.api
          .url(this.api.launchUrl);
        this
          .section.navigation
          .click(`.//*[contains(text(),'${page}')]`);
        return this;
      },
    },
  ],
  sections: {
    navigation: {
      selector: '.sd-Nav',
    },
  },
};
