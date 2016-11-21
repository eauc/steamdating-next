const path = require('path');
const somePlayers = require(path.resolve(`${__dirname}/../data/somePlayers.json`));
const morePlayersFilterMatches = {
  toto: {
    headers: ['Name', 'Origin', 'Faction', 'Lists'],
    players: [
      ['toto', 'lyon', 'Everblight', 'Absylonia1, Bethayne1'],
    ],
  },
  lyon: {
    headers: ['Name', 'Origin', 'Faction', 'Lists'],
    players: [
      ['tete', 'lyon', 'Khador', 'Butcher2, Koslov1'],
      ['toto', 'lyon', 'Everblight', 'Absylonia1, Bethayne1'],
    ],
  },
  kha: {
    headers: ['Name', 'Faction', 'Origin', 'Lists'],
    players: [
      ['tete', 'Khador', 'lyon', 'Butcher2, Koslov1'],
    ],
  },
  abs: {
    headers: ['Name', 'Lists', 'Origin', 'Faction'],
    players: [
      ['toto', 'Absylonia1, Bethayne1', 'lyon', 'Everblight'],
      ['toutou', 'Absylonia1, Lylyth2', 'paris', 'Everblight'],
    ],
  },
};

module.exports = function () {
  this.Given('I open Players page', function () {
    this.currentPage = this.page.players()
      .visit();
  });

  this.Given('more Players have been defined', function () {
    this.page.file()
      .visit()
      .doOpen('../data/morePlayers.json');
  });

  this.Given('some Players have been defined', function () {
    this.page.file()
      .visit()
      .doOpen('../data/somePlayers.json');
  });

  this.When('I start to create Player', function () {
    this.currentPage.doStartCreatePlayer();
  });

  this.When('I create a valid Player', function () {
    this.currentPage.doCreatePlayer({
      name: 'Toto',
      origin: 'Lyon',
      faction: 'Everblight',
      lists: ['Fyanna2', 'Absylonia1'],
      notes: 'Notes sur le joueur',
    });
  });

  this.When('I try to create a Player whose name already exists', function () {
    this.currentPage.doTryToCreatePlayer({ name: 'toto' });
  });

  this.When('I edit a Player', function () {
    return this.currentPage.doUpdatePlayer(
      somePlayers.players[1],
      { name: 'tete', origin: 'paris', faction: 'Cryx', lists: ['Agathia1','Asphyxious2'] }
    );
  });

  this.When('I delete a Player', function () {
    this.currentPage.doDeletePlayer(somePlayers.players[1].name);
  });

  this.When('I filter the Players list with "$filter"', function (filter) {
    this.currentPage.doFilterWith(filter);
  });

  this.When('I sort the Players list by "$by"', function (by) {
    this.currentPage.doSortBy(by);
  });

  this.When('I invert the sort order', function () {
    this.currentPage.doInvertSort();
  });

  this.Then('I can edit the Player information', function () {
    this.currentPage.expectPlayerEditForm();
  });

  this.Then('I see the created Player in the Players list', function () {
    this.currentPage.expectCreatedPlayerInList();
  });

  this.Then('I see the updated Player in the Players list', function () {
    this.currentPage
      .expectUpdatedPlayerInList()
      .expectUpdatedPlayerPreviousStateNotInList();
  });

  this.Then('I cannot create the invalid Player', function () {
    this.page.form()
      .expectInputError('Name', 'already exists')
      .expectSubmitToBeDisabled();
  });

  this.Then('I do not see the deleted Player in the Players list', function () {
    this.currentPage.expectDeletedPlayerNotInList();
  });

  this.Then('I see the matching Players with the matching columns first', function () {
    this.currentPage
      .expectPlayersListWithHeaders(
        morePlayersFilterMatches[this.currentPage.filterValue]
      );
  });

  this.Then('I see the Players sorted by "$by"', function (_by_) {
    this.currentPage
      .expectPlayersList([
        ['toto'   , 'lyon'    , 'Everblight'  , 'Absylonia1, Bethayne1' ],
        ['toutou' , 'paris'   , 'Everblight'  , 'Absylonia1, Lylyth2'   ],
        ['tete'   , 'lyon'    , 'Khador'      , 'Butcher2, Koslov1'   ],
        ['titi'   , 'dijon'   , 'Menoth'      , 'Amon1, Feora1'    ],
        ['tyty'   , 'nantes'  , 'Menoth'      , 'Malekus1, Severius1' ],
        ['tutu'   , 'aubagne' , 'Mercenaries' , 'Bartolo1, Cyphon1'   ],
        ['teuteu' , 'paris'   , 'Scyrah'      , 'Helynna1, Vyros1'    ],
      ]);
  });

  this.Then('I see the Players sorted by "$by" in revert order', function (_by_) {
    this.currentPage
      .expectPlayersList([
        ['teuteu' , 'paris'   , 'Scyrah'      , 'Helynna1, Vyros1'    ],
        ['tutu'   , 'aubagne' , 'Mercenaries' , 'Bartolo1, Cyphon1'   ],
        ['tyty'   , 'nantes'  , 'Menoth'      , 'Malekus1, Severius1' ],
        ['titi'   , 'dijon'   , 'Menoth'      , 'Amon1, Feora1'    ],
        ['tete'   , 'lyon'    , 'Khador'      , 'Butcher2, Koslov1'   ],
        ['toutou' , 'paris'   , 'Everblight'  , 'Absylonia1, Lylyth2'   ],
        ['toto'   , 'lyon'    , 'Everblight'  , 'Absylonia1, Bethayne1' ],
      ]);
  });
};
