const R = require('ramda');

module.exports = {
  commands: [
    {
      visit() {
        this.api.page.nav()
          .visitPage('Rounds');
        return this;
      },
      nbGamesForPlayers(players) {
        return Math.floor((players.length + 1) / 2);
      },
      setPlayersNames(nameIndexPairs) {
        R.forEach(([index, name]) => {
          this.setPlayerName(index, name);
          this.api.waitForElementNotPresent(
            `//option[contains(text(), "> ${this.lastPlayerOptionText}")]`,
            1000, true
          );
        }, nameIndexPairs);
      },
      setPlayerName(index, name) {
        const inputSelector = `(//select)[${index + 1}]`;
        const optionSelector = `/option[contains(text(), "${name}")]`;
        let textValue;
        this.api.getText(`${inputSelector}${optionSelector}`, (text) => {
          textValue = text.value;
          this.api.setValue(inputSelector, textValue);
          this.api.setValue('//input[1]', '');
        });
        this.lastPlayerOptionText = textValue;
        return this;
      },
      expectGamesFormsForPlayers(players) {
        const nbGames = this.nbGamesForPlayers(players);
        const gameRow = this.section.pageContent.elements.gameRow;
        this.api.elements(
          gameRow.locateStrategy,
          gameRow.selector,
          (result) => {
            this.assert.equal(
              result.value.length, nbGames,
              `ExpectGamesForPlayers : count games rows '${gameRow.selector}'`
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
        const inputSelector = `(//select)[${index + 1}]`;
        this.expect.element(inputSelector).to.have.value.that.equals('');
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
  sections: {
    pageContent: {
      selector: '//*[contains(@class, \'sd-Page\')]',
      locateStrategy: 'xpath',
      elements: {
        gameRow: {
          selector: '//tr[count(.//select)=2 and count(.//input[@type="number"])=1]',
          locateStrategy: 'xpath',
        },
      },
    },
  },
};
