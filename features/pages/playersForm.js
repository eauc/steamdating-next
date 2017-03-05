const R = require('ramda');
const { createPage } = require('../helpers/page.js');

module.exports = createPage({
  commands: [
    {
      doStartCreatePlayer() {
        this.api
          .click(this.selector('createPlayer'));
        return this;
      },
      doTryToCreatePlayer(player) {
        this.doStartCreatePlayer();
        this.doFillPlayerForm(player);
        return this;
      },
      doCreatePlayer(player) {
        this.doTryToCreatePlayer(player);
        this.api.page.form().doSubmit();
        return this;
      },
      doUpdatePlayer(current, updateTo) {
        this.api
          .click(this.selector('playerRow', current.name));
        this.expectPlayerEditForm(current);
        this.doFillPlayerForm(updateTo);
        this.api.page.form().doSubmit();
        return this;
      },
      doFillPlayerForm(player) {
        const form = this.api.page.form();
        if (!R.isNil(player.name)) {
          form.doSetLabelInputValue('Name', player.name);
        }
        if (!R.isNil(player.origin)) {
          form.doSetLabelInputValue('Origin', player.origin);
        }
        if (!R.isNil(player.notes)) {
          form.doSetLabelInputValue('Notes', player.notes);
        }
        if (!R.isNil(player.faction)) {
          form.doSelectValue('Faction', player.faction);
          this.api.pause(500);
        }
        if (!R.isNil(player.lists)) {
          form.doSelectMultipleValues('Lists', player.lists);
        }
        this.api.pause(500);
        return this;
      },
      expectPlayerEditForm(player = {}) {
        this.api.page.form()
          .expectInput('Name', { value: player.name })
          .expectInput('Origin', { value: player.origin })
          .expectInput('Faction', { value: player.factions, inputTag: 'select' })
          .expectInput('Lists', { value: player.lists, inputTag: 'select' })
          .expectInput('Notes', { value: player.notes, inputTag: 'textarea' });
        return this;
      },
    },
  ],
  selectors: {
    createPlayer: ['menu', '//*[contains(text(),\'Create Player\')]'],
    playerRow: ['page', (name) => `//*[contains(text(), "${name}")]`],
  },
});
