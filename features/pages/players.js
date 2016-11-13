const R = require('ramda');

module.exports = {
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Players');
        return this;
      },
      doCreatePlayer(player) {
        this.doTryToCreatePlayer(player);
        this.api.page.form().doSubmit();
        this.createdPlayer = player;
        return this;
      },
      doDeletePlayer(name) {
        this.section.pageContent
          .click(`.//*[contains(text(), "${name}")]`);
        this.section.pageContent
          .click('@deletePlayer');
        this.api.page.prompt()
          .doOk();
        this.deletedPlayerName = name;
        return this;
      },
      doUpdatePlayer(current, updateTo) {
        this.section.pageContent
          .click(`.//*[contains(text(), "${current.name}")]`);
        this.expectPlayerEditForm(current);
        this.doFillPlayerForm(updateTo);
        this.api.page.form().doSubmit();
        this.updatedPlayer = updateTo;
        this.updatedPlayerPreviousName = current.name;
        return this;
      },
      doFillPlayerForm(player) {
        const form = this.api.page.form();
        if (!R.isNil(player.name)) {
          form.doSetInputValue('Name', player.name);
        }
        if (!R.isNil(player.origin)) {
          form.doSetInputValue('Origin', player.origin);
        }
        if (!R.isNil(player.notes)) {
          form.doSetInputValue('Notes', player.notes);
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
      doStartCreatePlayer() {
        this.section.pageContent
          .click('@createPlayer');
        return this;
      },
      doTryToCreatePlayer(player) {
        this.doStartCreatePlayer();
        this.doFillPlayerForm(player);
        return this;
      },
      expectCreatedPlayerInList() {
        return this.expectPlayerInList(this.createdPlayer);
      },
      expectUpdatedPlayerInList() {
        return this.expectPlayerInList(this.updatedPlayer);
      },
      expectPlayerInList(player) {
        const values = R.flatten(R.values(R.omit(['notes'], player)));
        const texts = R.map((value) => `[.//*[contains(text(), "${value}")]]`, values);
        const lineSelector = `//tr${texts.join('')}`;
        this.expect.element(lineSelector).to.be.visible;
        return this;
      },
      expectDeletedPlayerNotInList() {
        return this.expectPlayerNotInList(this.deletedPlayerName);
      },
      expectUpdatedPlayerPreviousStateNotInList() {
        return this.expectPlayerNotInList(this.updatedPlayerPreviousName);
      },
      expectPlayerNotInList(name) {
        this.expect.element(`//*[contains(text(), "${name}")]`)
          .not.to.be.present;
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
  sections: {
    pageContent: {
      selector: '//*[contains(@class, \'sd-Page\')]',
      locateStrategy: 'xpath',
      elements: {
        createPlayer: {
          selector: './/*[contains(text(),\'Create Player\')]',
          locateStrategy: 'xpath',
        },
        deletePlayer: {
          selector: './/*[contains(text(),\'Delete Player\')]',
          locateStrategy: 'xpath',
        },
      },
    },
  },
};
