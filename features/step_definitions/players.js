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
    this.currentPage.doCreateDummyPlayer();
  });

  this.When('I try to create a Player whose name already exists', function () {
    this.currentPage.doTryToCreatePlayer({ name: 'toto' });
  });

  this.Then('I can edit the Player information', function () {
    this.currentPage.expectPlayerEditForm();
  });

  this.Then('I see the new Player in the Players list', function () {
    this.currentPage.expectDummyPlayerInList();
  });

  this.Then('I cannot create the invalid Player', function () {
    this.page.form()
      .expectInputError('Name', '"Name" already exists')
      .expectSubmitToBeDisabled();
  });
};
