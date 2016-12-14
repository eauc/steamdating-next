import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { playersStartCreateHandler,
         playersOpenCreateHandler,
         playersStartEditHandler,
         playersOpenEditHandler,
         playersCloseEditHandler,
         playersUpdateCurrentEditHandler,
         playersCreateCurrentEditHandler,
         playersRemoveCurrentEditHandler,
       } from 'app/components/players/handler';

describe('playersComponent', function () {
  beforeEach(function () {
    this.state = {};
    this.history = jasmine.createSpyObj('history', [
      'goBack', 'push',
    ]);
  });

  context('playersStartCreateHandler()', function () {
    return playersStartCreateHandler();
  }, function () {
    it('should reset player form then open create page', function () {
      expect(this.context)
        .toEqual({
          dispatch: [
            { eventName: 'form-reset', formName: 'player', value: {} },
            { eventName: 'players-openCreate' },
          ],
        });
    });
  });

  context('playersOpenCreateHandler()', function () {
    return playersOpenCreateHandler({ history: this.history });
  }, function () {
    it('should open create page', function () {
      expect(this.history.push)
        .toHaveBeenCalledWith('/players/create');
    });
  });


  context('playersStartEditHandler(<player>)', function () {
    return playersStartEditHandler('state', { player: 'playertoEdit' });
  }, function () {
    it('should reset player form then open edit page', function () {
      expect(this.context)
        .toEqual({
          dispatch: [
            { eventName: 'form-reset', formName: 'player', value: 'playertoEdit' },
            { eventName: 'players-openEdit' },
          ],
        });
    });
  });

  context('playersOpenEditHandler(<player>)', function () {
    return playersOpenEditHandler({ history: this.history });
  }, function () {
    it('should open edit page', function () {
      expect(this.history.push)
        .toHaveBeenCalledWith('/players/edit');
    });
  });

  context('playersCloseEditHandler()', function () {
    return playersCloseEditHandler({ history: this.history });
  }, function () {
    it('should close edit page', function () {
      expect(this.history.goBack)
        .toHaveBeenCalledTimes(1);
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
            { eventName: 'players-closeEdit' },
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
            { eventName: 'players-closeEdit' },
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
            { eventName: 'players-closeEdit' },
          ],
        });
    });
  });
});
