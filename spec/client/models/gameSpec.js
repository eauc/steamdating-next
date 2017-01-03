import { example } from 'spec/client/helpers/helpers';

import gameModel from 'app/models/game';

describe('gameModel', function () {
  describe('playersNames()', function () {
    example(function ({ game, names }, desc) {
      it(`should extract <game>'s players names, ${desc}`, function () {
        expect(gameModel.playersNames(game))
          .toEqual(names);
      });
    }, [
      ['game', 'names'],
      [{ player1: { name: 'tata' }, player2: { name: 'toto' } }, ['tata','toto']],
      [{ player1: { name: null }, player2: { name: 'toto' } }, [null,'toto']],
      [{ player1: { name: 'tata' }, player2: { name: null } }, ['tata',null]],
      [{ player1: { name: null }, player2: { name: null } }, [null, null]],
    ]);
  });

  describe('isMirror({ playersFactions })', function () {
    beforeEach(function () {
      this.playersFactions = {
        tata: 'khador',
        toto: 'khador',
        tutu: 'legion',
      };
    });

    example(function ({ game, isMirror }, desc) {
      it(`should extract <game>'s players names, ${desc}`, function () {
        expect(gameModel.isMirror({
          playersFactions: this.playersFactions,
        }, game)).toEqual(isMirror);
      });
    }, [
      ['game', 'isMirror'],
      [{ player1: { name: 'tata' }, player2: { name: 'tutu' } }, false],
      [{ player1: { name: 'tata' }, player2: { name: 'toto' } }, true],
      [{ player1: { name: null }, player2: { name: 'toto' } }, false],
      [{ player1: { name: 'tata' }, player2: { name: null } }, false],
      [{ player1: { name: null }, player2: { name: null } }, false],
    ]);
  });
});
