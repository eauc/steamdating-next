const R = require('ramda');

const CONST = {
  dummyPlayer: {
    name: 'Toto',
    origin: 'Lyon',
    faction: 'Everblight',
    lists: ['Fyanna2', 'Absylonia1'],
    notes: 'Notes sur le joueur',
  },
};

module.exports = {
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Players');
        return this;
      },
      doStartCreatePlayer() {
        this.section.pageContent
          .click('@createPlayer');
        return this;
      },
      doCreateDummyPlayer() {
        return this.doCreatePlayer(CONST.dummyPlayer);
      },
      doCreatePlayer(player) {
        this.doTryToCreatePlayer(player);
        this.api.page.form().doSubmit();
        return this;
      },
      doTryToCreatePlayer(player) {
        this.doStartCreatePlayer();
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
          form.doSelectMultipleValues('Lists', CONST.dummyPlayer.lists);
        }
        this.api.pause(500);
        return this;
      },
      expectDummyPlayerInList() {
        return this.expectPlayerInList(CONST.dummyPlayer);
      },
      expectPlayerInList(player) {
        const values = R.flatten(R.values(R.omit(['notes'], player)));
        const texts = R.map((value) => `[.//*[contains(text(), "${value}")]]`, values);
        const lineSelector = `//tr${texts.join('')}`;
        this.expect.element(lineSelector).to.be.visible;
        return this;
      },
      expectPlayerEditForm() {
        this.api.page.form()
          .expectInput('Name')
          .expectInput('Origin')
          .expectInput('Faction', { inputTag: 'select' })
          .expectInput('Lists', { inputTag: 'select' })
          .expectInput('Notes', { inputTag: 'textarea' });
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
      },
    },
  },
};
