module.exports = {
  commands: [
    {
      expectMessage(message) {
        this.expect.element('@toaster')
          .text.to.equal(message)
          .to.be.visible;
        this.api.pause(1200);
        this.expect.element('@toaster')
          .not.to.be.visible;
      },
    },
  ],
  elements: {
    toaster: {
      selector: '.sd-Toaster',
    },
  },
};
