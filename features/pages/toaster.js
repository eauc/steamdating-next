module.exports = {
  commands: [
    {
      expectMessage(message) {
        this.expect.element('@toaster')
          .text.to.equal(message)
          .to.be.visible;
        this.api.pause(2000);
        this.expect.element('@toaster')
          .not.to.be.visible;
        return this;
      },
    },
  ],
  elements: {
    toaster: {
      selector: '.sd-Toaster',
    },
  },
};
