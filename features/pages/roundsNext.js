const R = require('ramda');
const { createPage } = require('../helpers/page.js');

module.exports = createPage({
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Rounds');
        this.api.click(this.selector('nextRoundNav'));
        return this;
      },
      nbGamesForPlayers(players) {
        return Math.floor((players.length + 1) / 2);
      },
      doSetPlayersNames(nameIndexPairs) {
        R.forEach(([index, name]) => {
          this.doSetPlayerName(index, name);
          this.api.waitForElementNotPresent(
            this.selector('unselectedPlayerOption', this.lastPlayerOptionText),
            1000, true
          );
        }, nameIndexPairs);
        return this;
      },
      doSetPlayerName(index, name) {
        const inputSelector = this.selector('gamePlayerSelect', index);
        const optionSelector = `/option[contains(string(.), "${name}")]`;
        let textValue;
        this.api.getText(`${inputSelector}${optionSelector}`, (text) => {
          textValue = text.value;
          this.api.setValue(inputSelector, textValue);
          this.api.setValue('//input[1]', '');
        });
        this.lastPlayerOptionText = textValue;
        return this;
      },
      doSetTables(nbTables) {
        R.forEach((index) => {
          this.doSetTable(index, index + 1);
          this.api.pause(300);
        }, R.range(0, nbTables));
        return this;
      },
      doSetTable(index, value) {
        this.api.page.form()
          .doSetInputValue(this.selector('gameTableInput', index), value);
        return this;
      },
      expectGamesFormsForPlayers(players) {
        const nbGames = this.nbGamesForPlayers(players);
        this.api.elements(
          'xpath',
          this.selector('gameRow'),
          (result) => {
            this.assert.equal(
              result.value.length, nbGames,
              `ExpectGamesForPlayers : count games rows '${this.selector('gameRow')}'`
            );
          }
        );
        return this;
      },
      expectGamesSelectsForPlayers(players) {
        const nbGames = this.nbGamesForPlayers(players);
        const playersNames = R.pluck('name', players);
        const playersNamesOptions = R.map((name) => `./option[@value="${name}"]`, playersNames);
        const selector = `//tr//select[${R.join(' and ', playersNamesOptions)}]`;
        this.api.elements(
          'xpath', selector,
          (result) => {
            this.assert.equal(
              result.value.length, nbGames * 2,
              `ExpectGamesSelectsForPlayers : count selects with players names options '${selector}'`
            );
          }
        );
        return this;
      },
      expectPairingToBeEmpty(index) {
        this.expect.element(this.selector('gamePlayerSelect', index))
          .to.have.value.that.equals('');
        return this;
      },
      expectUnpairedPlayersError(unpairedPlayersNames) {
        const containsUnpairedPlayersNames = R.pipe(
          R.map((name) => `contains(text(), ${name})`),
          R.join(' and ')
        )(unpairedPlayersNames);
        this.expect
          .element(`//*[${containsUnpairedPlayersNames} and contains(text(), "are not paired")]`)
          .to.be.visible;
        return this;
      },
    },
  ],
  selectors: {
    nextRoundNav: ['menu', '//*[contains(text(), "Next Round")]'],
    gameRow: ['page', '//tr[count(.//select)=2 and count(.//input[@type="number"])=1]'],
    gamePlayerSelect(index) { return `(${this.section.page.selector}//select)[${index + 1}]`; },
    gameTableInput(index) { return `(${this.section.page.selector}//input)[${index + 1}]`; },
    unselectedPlayerOption: ['page', (name) => `//option[contains(string(.), "> ${name}")]`],
  },
});
