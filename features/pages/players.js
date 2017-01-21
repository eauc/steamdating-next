const R = require('ramda');

module.exports = {
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Players');
        this.doResetFilter();
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
          .click(`.//*[contains(text(), "${name}")]`)
          .click('@deletePlayer');
        this.api.page.prompt()
          .doOk();
        this.deletedPlayerName = name;
        return this;
      },
      doFilterWith(filter) {
        this.section.pageContent
          .clearValue('@playersListFilter')
          .setValue('@playersListFilter', filter);
        this.filterValue = filter;
        this.api.pause(500);
      },
      doInvertSort() {
        this.section.pageContent
          .click(`//*[contains(text(), "${this.sortBy}")]`);
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
      doResetFilter() {
        this.section.pageContent
          .clearValue('@playersListFilter')
          .setValue('@playersListFilter', '.');
        this.api.pause(200);
      },
      doStartCreatePlayer() {
        this.section.pageContent
          .click('@createPlayer');
        return this;
      },
      doSortBy(by) {
        this.section.pageContent
          .click('//*[contains(text(), "Name")]')
          .click(`//*[contains(text(), "${by}")]`);
        this.sortBy = by;
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
      expectPlayersListWithHeaders({ headers, players }) {
        const headersRegex = R.join('\\s+', headers);
        const playersRegex = R.join('\\s+', R.map(R.join('\\s+'), players));
        const listRegex = new RegExp(`^\\s*${headersRegex}\\s+${playersRegex}\\s*$`, 'i');
        this.section.pageContent
          .expect.element('@playersList').text
          .to.match(listRegex);
      },
      expectPlayersList(players) {
        const playersRegex = R.join('\\s+', R.map(R.join('\\s+'), players));
        const listRegex = new RegExp(`^\\s*${playersRegex}\\s*$`, 'i');
        this.section.pageContent
          .expect.element('@playersListBody').text
          .to.match(listRegex);
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
        playersList: {
          selector: './/table[.//th[.//*[contains(text(),\'Name\')]]]',
          locateStrategy: 'xpath',
        },
        playersListBody: {
          selector: './/table[.//th[.//*[contains(text(),\'Name\')]]]/tbody',
          locateStrategy: 'xpath',
        },
        playersListFilter: {
          selector: './/input[@placeholder="Filter"]',
          locateStrategy: 'xpath',
        },
      },
    },
  },
};
