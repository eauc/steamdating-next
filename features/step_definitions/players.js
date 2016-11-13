const path = require('path');
const somePlayers = require(path.resolve(`${__dirname}/../data/somePlayers.json`));

module.exports = function () {
  this.Given('I open Players page', function () {
    this.currentPage = this.page.players()
      .visit();
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
      .expectInputError('Name', '"Name" already exists')
      .expectSubmitToBeDisabled();
  });

  this.Then('I do not see the deleted Player in the Players list', function () {
    this.currentPage.expectDeletedPlayerNotInList();
  });
};
