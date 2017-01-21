import { example } from 'spec/client/helpers/helpers';

import gameModel from 'app/models/game';

describe('gameModel', function () {
  describe('resetPlayer({ name })', function () {
    beforeEach(function () {
      this.game = gameModel.create({
        player1: { name: 'toto' },
        player2: { name: 'titi' },
      });
    });

    example(function ({ name, result }, desc) {
      it(`should remove <name> from game, ${desc}`, function () {
        const gameResult = gameModel.resetPlayer({ name }, this.game);
        expect(gameModel.playersNames(gameResult))
          .toEqual(result);
      });
    }, [
      ['name', 'result'],
      ['toto', [null, 'titi']],
      ['titi', ['toto', null]],
      ['other', ['toto', 'titi']],
    ]);
  });

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

  describe('winForPlayer({ name })', function () {
    example(function ({
      game: { p1name, p1tp, p2name, p2tp },
      name, win,
    }, desc) {
      it(`should return true if player <name> win the game, ${desc}`, function () {
        const game = gameModel.create({
          player1: { name: p1name, score: { tournament: p1tp } },
          player2: { name: p2name, score: { tournament: p2tp } },
        });
        expect(gameModel.winForPlayer({ name }, game))
          .toBe(win);
      });
    }, [
      ['game', 'name', 'win'],
      [{ p1name: 'toto', p1tp: null, p2name: 'titi', p2tp: null }, 'toto', false],
      [{ p1name: 'toto', p1tp: null, p2name: 'titi', p2tp: null }, 'titi', false],
      [{ p1name: 'toto', p1tp: 1, p2name: 'titi', p2tp: 0 }, 'toto', true],
      [{ p1name: 'toto', p1tp: 0, p2name: 'titi', p2tp: 1 }, 'toto', false],
      [{ p1name: 'toto', p1tp: 1, p2name: 'titi', p2tp: 0 }, 'titi', false],
      [{ p1name: 'toto', p1tp: 1, p2name: 'titi', p2tp: 0 }, 'tutu', false],
      [{ p1name: 'toto', p1tp: 1, p2name: 'titi', p2tp: 1 }, 'titi', true],
      [{ p1name: 'toto', p1tp: 0, p2name: 'titi', p2tp: 0 }, 'toto', false],
    ]);
  });

  describe('lossForPlayer({ name })', function () {
    example(function ({
      game: { p1name, p1tp, p2name, p2tp },
      name, loss,
    }, desc) {
      it(`should return true if player <name> loss the game, ${desc}`, function () {
        const game = gameModel.create({
          player1: { name: p1name, score: { tournament: p1tp } },
          player2: { name: p2name, score: { tournament: p2tp } },
        });
        expect(gameModel.lossForPlayer({ name }, game))
          .toBe(loss);
      });
    }, [
      ['game', 'name', 'loss'],
      [{ p1name: 'toto', p1tp: null, p2name: 'titi', p2tp: null }, 'toto', false],
      [{ p1name: 'toto', p1tp: null, p2name: 'titi', p2tp: null }, 'titi', false],
      [{ p1name: 'toto', p1tp: 1, p2name: 'titi', p2tp: 0 }, 'toto', false],
      [{ p1name: 'toto', p1tp: 0, p2name: 'titi', p2tp: 1 }, 'toto', true],
      [{ p1name: 'toto', p1tp: 1, p2name: 'titi', p2tp: 0 }, 'titi', true],
      [{ p1name: 'toto', p1tp: 1, p2name: 'titi', p2tp: 0 }, 'tutu', false],
      [{ p1name: 'toto', p1tp: 1, p2name: 'titi', p2tp: 1 }, 'titi', false],
      [{ p1name: 'toto', p1tp: 0, p2name: 'titi', p2tp: 0 }, 'toto', true],
    ]);
  });
});
