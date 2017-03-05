const R = require('ramda');
const matchingGames = {
  to: [
    { p1ap: 32, p1cp: 3, p1: 'titi', table: 2, p2: 'toto', p2cp: 5, p2ap: 75 },
    { p1ap: 46, p1cp: 0, p1: 'toutou', table: 3, p2: 'tutu', p2cp: 4, p2ap: 30 },
  ],
  te: [
    { p1ap: 52, p1cp: 5, p1: 'tete', table: 1, p2: 'teuteu', p2cp: 3, p2ap: 21 },
  ],
};
const sortedGames = {
  Player2: [
    { p1ap: 0, p1cp: 0, p1: 'tyty', table: 4, p2: 'Phantom', p2cp: 0, p2ap: 0 },
    { p1ap: 52, p1cp: 5, p1: 'tete', table: 1, p2: 'teuteu', p2cp: 3, p2ap: 21 },
    { p1ap: 32, p1cp: 3, p1: 'titi', table: 2, p2: 'toto', p2cp: 5, p2ap: 75 },
    { p1ap: 46, p1cp: 0, p1: 'toutou', table: 3, p2: 'tutu', p2cp: 4, p2ap: 30 },
  ],
  Table: [
    { p1ap: 52, p1cp: 5, p1: 'tete', table: 1, p2: 'teuteu', p2cp: 3, p2ap: 21 },
    { p1ap: 32, p1cp: 3, p1: 'titi', table: 2, p2: 'toto', p2cp: 5, p2ap: 75 },
    { p1ap: 46, p1cp: 0, p1: 'toutou', table: 3, p2: 'tutu', p2cp: 4, p2ap: 30 },
    { p1ap: 0, p1cp: 0, p1: 'tyty', table: 4, p2: 'Phantom', p2cp: 0, p2ap: 0 },
  ],
};

module.exports = function () {
  this.Given('some Rounds have been defined', function () {
    this.page.file()
      .visit()
      .doOpen('../data/someRounds.json');
  });

  this.Given('I open Rounds/Next page', function () {
    this.currentPage = this.page.roundsNext()
      .visit();
  });

  this.Given(/^I open Rounds\/(\d+) page$/, function (index) {
    this.currentPage = this.page.roundsNth()
      .visit(index);
  });

  this.Given('some players are paired', pairSomePlayers);

  this.When('I filter the Round with "$filter"', function (filter) {
    this.currentPage
      .doFilterWith(filter);
    this.filterValue = filter;
  });

  this.When('I sort the Round by "$by"', function (by) {
    this.currentPage
      .doFilterWith('.')
      .doSortBy(by);
    this.by = by;
  });

  this.When('I invert the Round sort order', function () {
    this.currentPage
      .doSortBy(this.by);
  });

  this.When('I pair all available players', function () {
    const playersNames = R.pluck('name', this.players);
    const playersNamesPairs = R.addIndex(R.map)(
      (name, index) => [index, name],
      playersNames
    );
    this.currentPage.doSetPlayersNames(playersNamesPairs);
    this.currentPage.doSetTables((playersNames.length + 1) / 2);
    this.roundIndex = 1;
    this.games = R.addIndex(R.map)(([p1, p2 = 'Phantom'], index) => ({
      p1,
      table: index + 1,
      p2,
    }), R.splitEvery(2, playersNames));
  });

  this.When('I pair some players', pairSomePlayers);

  this.When('I select a player who is already paired', function () {
    this.changedPairingIndex = 1;
    this.changedPairingName = this.pairedPlayersNames[this.changedPairingIndex];
    this.currentPage
      .doSetPlayerName(this.unpairedIndices[0], this.changedPairingName);
  });

  this.When('I create the Next Round', function () {
    this.page.form()
      .doSubmit();
  });

  this.Then('I can edit the Next Round information', function () {
    this.currentPage
      .expectGamesFormsForPlayers(this.players)
      .expectGamesSelectsForPlayers(this.players);
  });

  this.Then('I see the New Round\'s page', function () {
    this.page.roundsNth()
      .expectGames(this);
  });

  this.Then('I cannot create the Next Round', function () {
    this.page.form()
      .expectSubmitToBeDisabled();
  });

  this.Then('I see an error with the unpaired players names', function () {
    this.currentPage
      .expectUnpairedPlayersError(this.unpairedPlayersNames);
  });

  this.Then('the player name is removed from its previous pairing', function () {
    this.currentPage
      .expectPairingToBeEmpty(this.changedPairingIndex);
  });

  this.Then('I see the matching Games', function () {
    this.currentPage
      .expectGames({ games: matchingGames[this.filterValue] });
  });

  this.Then('I see the Round sorted by "$by"', function (by) {
    this.currentPage
      .expectGames({ games: sortedGames[by] });
  });

  this.Then('I see the Round sorted by "$by" in reverse order', function (by) {
    this.currentPage
      .expectGames({ games: R.reverse(sortedGames[by]) });
  });
};

function pairSomePlayers() {
  const playersNames = R.pluck('name', this.players);
  this.pairedIndices = [0, 1, 3, 5];
  this.unpairedIndices = R.without(
    this.pairedIndices,
    R.range(0, R.length(playersNames))
  );
  this.pairedPlayersNames = R.map(
    R.nth(R.__, playersNames),
    this.pairedIndices
  );
  this.unpairedPlayersNames = R.map(
    R.nth(R.__, playersNames),
    this.unpairedIndices
  );

  const nameIndexPairs = R.map(
    (index) => [index, playersNames[index]],
    this.pairedIndices
  );
  this.currentPage
    .doSetPlayersNames(nameIndexPairs);
}
