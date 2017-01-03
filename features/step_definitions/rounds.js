const R = require('ramda');

module.exports = function () {
  this.Given('I open Rounds/Next page', function () {
    this.currentPage = this.page.rounds()
      .visit();
  });

  this.Given('some players are paired', pairSomePlayers);

  this.When('I pair all available players', function () {
    const playersNames = R.pluck('name', this.players);
    const playersNamesPairs = R.addIndex(R.map)(
      (name, index) => [index, name],
      playersNames
    );
    this.currentPage.setPlayersNames(playersNamesPairs);
  });

  this.When('I pair some players', pairSomePlayers);

  this.When('I select a player who is already paired', function () {
    this.changedPairingIndex = 1;
    this.changedPairingName = this.pairedPlayersNames[this.changedPairingIndex];
    this.currentPage
      .setPlayerName(this.unpairedIndices[0], this.changedPairingName);
  });

  this.Then('I can edit the Next Round information', function () {
    this.currentPage
      .expectGamesFormsForPlayers(this.players)
      .expectGamesSelectsForPlayers(this.players);
  });

  this.Then('I can create the Next Round', function () {
    this.page.form()
      .expectSubmitToBeEnabled();
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
    .setPlayersNames(nameIndexPairs);
}
