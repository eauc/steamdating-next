const R = require('ramda');
const { createPage } = require('../helpers/page.js');

module.exports = createPage({
  commands: [
    {
      visit(index) {
        this.api.page.nav()
          .visitPage('Rounds');
        this.api.click(this.selector('nthRoundNav', index));
        return this;
      },
      doFilterWith(filter) {
        this.api
          .clearValue(this.selector('roundFilter'))
          .setValue(this.selector('roundFilter'), filter)
          .pause(500);
        this.filterValue = filter;
        return this;
      },
      doSortBy(by) {
        this.api
          .click(this.selector('sortHeader', by));
        this.sortBy = by;
        return this;
      },
      expectGames({ roundIndex, games }) {
        if (roundIndex) {
          this.api.expect
            .element(this.selector('nthRoundTitle', roundIndex))
            .to.be.visible;
        }
        const gamesRegExp = R.pipe(
          R.map(({
            p1 = 'Phantom',
          p1ap = 0,
            p1cp = 0,
            table = 0,
            p2 = 'Phantom',
            p2ap = 0,
            p2cp = 0,
          }) => `${p1ap}.*${p1cp}.*${p1}.*${table}.*${p2}.*${p2cp}.*${p2ap}`),
          R.join('.*\n.*'),
          (gamesString) => new RegExp(gamesString, 'i')
        )(games);
        this.api.expect
          .element(`//table[contains(string(.), ${games[0].p1})]`)
          .text.to.match(gamesRegExp);
        return this;
      },
    },
  ],
  selectors: {
    nthRoundNav: ['menu', (index) => `//a[contains(string(.), "Round${index}")]`],
    nthRoundTitle: ['page', (index) => `//h4[contains(string(.), "Round ${index}")]`],
    roundFilter: ['page', '//input[@placeholder="Filter"]'],
    sortHeader: ['page', (by) => `//*[contains(text(), "${by}")]`],
  },
});
