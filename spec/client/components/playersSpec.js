import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { playersStartCreateHandler,
         playersStartEditHandler,
         playersUpdateCurrentEditHandler,
         playersCreateCurrentEditHandler,
         playersRemoveCurrentEditHandler,
       } from 'app/components/players/handler';

describe('playersComponent', function () {
  beforeEach(function () {
    this.state = {};
  });

  context('playersStartCreateHandler()', function () {
    return playersStartCreateHandler();
  }, function () {
    it('should reset player form then open create page', function () {
      expect(this.context)
        .toEqual({
          dispatch: [
            { eventName: 'form-reset', formName: 'player', value: {} },
            { eventName: 'navigate', to: '/players/create' },
          ],
        });
    });
  });

  context('playersStartEditHandler(<player>)', function () {
    return playersStartEditHandler(
      this.state,
      { player: { name: this.playerToEdit.name } }
    );
  }, function () {
    beforeEach(function () {
      this.state = {
        tournament: {
          players: [
            { name: 'player1' },
            { name: 'player2' },
            { name: 'player3' },
            { name: 'player4' },
            { name: 'player5' },
          ],
        },
      };
      this.playerToEdit = this.state.tournament.players[2];
    });

    it('should reset player form then open edit page', function () {
      expect(this.context)
        .toEqual({
          dispatch: [
            { eventName: 'form-reset', formName: 'player', value: this.playerToEdit },
            { eventName: 'navigate', to: '/players/edit' },
          ],
        });
    });
  });

  context('playersCreateCurrentEditHandler({ state })', function () {
    return playersCreateCurrentEditHandler(this.state);
  }, function () {
    beforeEach(function () {
      this.state.forms = { player: { edit: 'playerEditForm' } };
    });

    it('should create currently edited player into players list and close Edit page', function () {
      expect(this.context)
        .toEqual({
          dispatch: [
            { eventName: 'players-create', edit: 'playerEditForm' },
            { eventName: 'navigate-back' },
          ],
        });
    });
  });

  context('playersUpdateCurrentEditHandler({ state })', function () {
    return playersUpdateCurrentEditHandler(this.state);
  }, function () {
    beforeEach(function () {
      this.state.forms = { player: { edit: 'playerEditForm' } };
    });

    it('should update currently edited player from players list and close Edit page', function () {
      expect(this.context)
        .toEqual({
          dispatch: [
            { eventName: 'players-update', edit: 'playerEditForm' },
            { eventName: 'navigate-back' },
          ],
        });
    });
  });

  context('playersRemoveCurrentEditHandler({ state })', function () {
    return playersRemoveCurrentEditHandler(this.state);
  }, function () {
    beforeEach(function () {
      this.state.forms = { player: { base: 'currentEditPlayer' } };
    });

    it('should remove currently edited player from players list and close Edit page', function () {
      expect(this.context)
        .toEqual({
          dispatch: [
            { eventName: 'players-remove', player: 'currentEditPlayer' },
            { eventName: 'navigate-back' },
          ],
        });
    });
  });
});
