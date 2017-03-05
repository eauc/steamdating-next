const R = require('ramda');
const { createPage } = require('../helpers/page.js');

module.exports = createPage({
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Players');
        this.doResetFilter();
        return this;
      },
      doDeletePlayer(name) {
        this.api
          .click(this.selector('playerRow', name))
          .click(this.selector('deletePlayer'))
          .page.prompt().doOk();
        return this;
      },
      doFilterWith(filter) {
        this.api
          .clearValue(this.selector('playersListFilter'))
          .setValue(this.selector('playersListFilter'), filter);
        this.filterValue = filter;
        this.api.pause(500);
      },
      doResetFilter() {
        this.api
          .clearValue(this.selector('playersListFilter'))
          .setValue(this.selector('playersListFilter'), '.')
          .pause(200);
      },
      doSortBy(by) {
        this.api
          .click(this.selector('playersListHeader', 'Name'))
          .click(this.selector('playersListHeader', by));
        this.sortBy = by;
        return this;
      },
      doInvertSort() {
        this.api
          .click(this.selector('playersListHeader', this.sortBy));
        return this;
      },
      expectPlayerInList(player) {
        const values = R.flatten(R.values(R.omit(['notes'], player)));
        const texts = R.map((value) => `[.//*[contains(text(), "${value}")]]`, values);
        const lineSelector = this.withinSection(
          'page',
          `//tr${texts.join('')}`
        );
        this.expect.element(lineSelector).to.be.visible;
        return this;
      },
      expectPlayerNotInList(name) {
        this.expect.element(`//*[contains(text(), "${name}")]`)
          .not.to.be.present;
        return this;
      },
      expectPlayersListWithHeaders({ headers, players }) {
        const headersRegex = R.join('\\s+', headers);
        const playersRegex = R.join('\\s+', R.map(R.join('\\s+'), players));
        const listRegex = new RegExp(`^\\s*${headersRegex}\\s+${playersRegex}\\s*$`, 'i');
        this.api
          .expect.element(this.selector('playersList')).text
          .to.match(listRegex);
      },
      expectPlayersList(players) {
        const playersRegex = R.join('\\s+', R.map(R.join('\\s+'), players));
        const listRegex = new RegExp(`^\\s*${playersRegex}\\s*$`, 'i');
        this.api
          .expect.element(this.selector('playersListBody')).text
          .to.match(listRegex);
      },
    },
  ],
  selectors: {
    deletePlayer: ['menu', '//*[contains(text(),\'Delete Player\')]'],
    playersList: ['page', '//table[.//th[.//*[contains(text(),\'Name\')]]]'],
    playersListHeader: ['page', (column) => `//*[contains(text(), '${column}')]`],
    playersListBody: ['page', '//table[.//th[.//*[contains(text(),\'Name\')]]]/tbody'],
    playersListFilter: ['page', '//input[@placeholder="Filter"]'],
    playerRow: ['page', (name) => `//*[contains(text(), "${name}")]`],
  },
});
