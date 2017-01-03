import { example } from 'spec/client/helpers/helpers';

import roundModel from 'app/models/round';

describe('roundModel', function () {
  describe('annotatePairedPlayersNames({ players })', function () {
    beforeEach(function () {
      this.players = [
        { name: 'tata' },
        { name: 'toto' },
        { name: 'titi' },
        { name: 'tutu' },
        { name: 'tete' },
      ];
    });

    it('should return a list of paired players names', function () {
      const round = {
        games: [
          { player1: { name: 'tata' }, player2: { name: null } },
          { player1: { name: null }, player2: { name: 'tutu' } },
          { player1: { name: 'tete' }, player2: { name: null } },
        ],
      };

      expect(roundModel.annotatePairedPlayersNames({
        players: this.players,
      }, round)).toEqual([
        ['titi', '> titi'],
        ['toto', '> toto'],
        ['tata','tata'],
        ['tete','tete'],
        ['tutu','tutu'],
      ]);
    });
  });

  describe('validate({ players })', function () {
    beforeEach(function () {
      this.players = [
        { name: 'tata', faction: 'khador' },
        { name: 'toto', faction: 'cryx' },
        { name: 'titi', faction: 'khador' },
        { name: 'tutu', faction: 'menoth' },
        { name: 'tete', faction: 'legion' },
      ];
    });

    example(function ({ test, round, result }) {
      it(`should ${test}`, function () {
        expect(roundModel.validate({ players: this.players }, round))
          .toEqual(result);
      });
    }, [
      ['test','round','result'],
      ['check there are no errors', {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: 'tutu' } },
          { table: 2, player1: { name: 'titi' }, player2: { name: 'tete' } },
          { table: 3, player1: { name: 'toto' }, player2: { name: null } },
        ],
      }, {
        errors: [],
        warnings: [],
      }],
      ['check that all players are paired', {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: null } },
          { table: 2, player1: { name: null }, player2: { name: 'tete' } },
          { table: 3, player1: { name: 'toto' }, player2: { name: null } },
        ],
      }, {
        errors: ['Players titi, tutu are not paired'],
        warnings: [],
      }],
      ['check that players are not paired more than once', {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: 'toto' } },
          { table: 2, player1: { name: 'titi' }, player2: { name: 'toto' } },
          { table: 3, player1: { name: 'tutu' }, player2: { name: 'tete' } },
        ],
      }, {
        errors: ['Player toto is paired more than once'],
        warnings: [],
      }],
      ['check that players are not paired more than once', {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: 'toto' } },
          { table: 2, player1: { name: 'titi' }, player2: { name: 'toto' } },
          { table: 3, player1: { name: 'tata' }, player2: { name: 'tete' } },
        ],
      }, {
        errors: [
          'Player tutu is not paired',
          'Players tata, toto are paired more than once',
        ],
        warnings: [],
      }],
      ['warn about tables not affected', {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: 'toto' } },
          { table: 2, player1: { name: 'titi' }, player2: { name: 'tete' } },
          { table: 2, player1: { name: 'tutu' }, player2: { name: null } },
        ],
      }, {
        errors: [],
        warnings: ['Table 3 is not affected'],
      }],
      ['warn about tables not affected', {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: 'toto' } },
          { table: null, player1: { name: 'titi' }, player2: { name: 'tete' } },
          { table: 1, player1: { name: 'tutu' }, player2: { name: null } },
        ],
      }, {
        errors: [],
        warnings: ['Tables 2, 3 are not affected'],
      }],
      ['warn about mirror games', {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: 'titi' } },
          { table: 2, player1: { name: 'toto' }, player2: { name: 'tete' } },
          { table: 3, player1: { name: 'tutu' }, player2: { name: null } },
        ],
      }, {
        errors: [],
        warnings: ['There is 1 mirror game'],
      }],
      ['warn about mirror games', {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: 'titi' } },
          { table: 2, player1: { name: 'toto' }, player2: { name: 'tete' } },
          { table: 3, player1: { name: 'tutu' }, player2: { name: 'tutu' } },
        ],
      }, {
        errors: ['Player tutu is paired more than once'],
        warnings: ['There are 2 mirror games'],
      }],
    ]);
  });
});
