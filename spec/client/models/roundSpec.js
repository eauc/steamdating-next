import { example } from 'spec/client/helpers/helpers';

import roundModel from 'app/models/round';

describe('roundModel', function () {
  describe('setPlayerName(<fieldPath>, <name>)', function () {
    example(function ({ desc, fieldPath, name, result }) {
      it(`should set player name in <fieldPath> and remove it elsewhere, with ${desc}`, function () {
        const round = {
          games: [
            { player1: { name: 'tata' }, player2: { name: null } },
            { player1: { name: null }, player2: { name: 'tutu' } },
            { player1: { name: 'tete' }, player2: { name: null } },
          ],
        };

        expect(roundModel.setPlayerName(fieldPath, name, round).games)
          .toEqual(result);
      });
    }, [
      ['desc','fieldPath','name','result'],
      [
        'new name, no conflict',
        ['games','1','player1','name'], 'toto', [
          { player1: { name: 'tata' }, player2: { name: null } },
          { player1: { name: 'toto' }, player2: { name: 'tutu' } },
          { player1: { name: 'tete' }, player2: { name: null } },
        ],
      ],
      [
        'new name, conflict',
        ['games','0','player2','name'], 'tutu', [
          { player1: { name: 'tata' }, player2: { name: 'tutu' } },
          { player1: { name: null }, player2: { name: null } },
          { player1: { name: 'tete' }, player2: { name: null } },
        ],
      ],
      [
        'change name, no conflict',
        ['games','1','player2','name'], 'toto', [
          { player1: { name: 'tata' }, player2: { name: null } },
          { player1: { name: null }, player2: { name: 'toto' } },
          { player1: { name: 'tete' }, player2: { name: null } },
        ],
      ],
      [
        'change name, conflict',
        ['games','1','player2','name'], 'tata', [
          { player1: { name: null }, player2: { name: null } },
          { player1: { name: null }, player2: { name: 'tata' } },
          { player1: { name: 'tete' }, player2: { name: null } },
        ],
      ],
    ]);
  });

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

  describe('filter({ filterRegExp })', function () {
    beforeEach(function () {
      this.round = {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: null } },
          { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
          { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
          { table: 2, player1: { name: 'tutu' }, player2: { name: 'teuteu' } },
          { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
        ],
      };
    });

    example(function ({ filterRegExp, games }, desc) {
      it(`should sort round's games by <sort>, ${desc}`, function () {
        expect(roundModel.filter({ filterRegExp }, this.round).games)
          .toEqual(games);
      });
    }, [
      ['filterRegExp', 'games'],
      [/ta/, [
        { table: 1, player1: { name: 'tata' }, player2: { name: null } },
      ]],
      [/xy/, []],
      [/to/, [
        { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
        { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
      ]],
      [/ti/, [
        { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
        { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
      ]],
    ]);
  });

  describe('sort({ reverse, by })', function () {
    beforeEach(function () {
      this.round = {
        games: [
          { table: 1, player1: { name: 'tata' }, player2: { name: null } },
          { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
          { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
          { table: 2, player1: { name: 'tutu' }, player2: { name: 'teuteu' } },
          { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
        ],
      };
    });

    example(function ({ sort, games }, desc) {
      it(`should sort round's games by <sort>, ${desc}`, function () {
        expect(roundModel.sort(sort, this.round).games)
          .toEqual(games);
      });
    }, [
      ['sort', 'games'],
      [{ reverse: false, by: 'player1.name' }, [
        { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
        { table: 1, player1: { name: 'tata' }, player2: { name: null } },
        { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
        { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
        { table: 2, player1: { name: 'tutu' }, player2: { name: 'teuteu' } },
      ]],
      [{ reverse: true, by: 'player1.name' }, [
        { table: 2, player1: { name: 'tutu' }, player2: { name: 'teuteu' } },
        { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
        { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
        { table: 1, player1: { name: 'tata' }, player2: { name: null } },
        { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
      ]],
      [{ reverse: false, by: 'player2.name' }, [
        { table: 1, player1: { name: 'tata' }, player2: { name: null } },
        { table: 2, player1: { name: 'tutu' }, player2: { name: 'teuteu' } },
        { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
        { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
        { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
      ]],
      [{ reverse: true, by: 'player2.name' }, [
        { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
        { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
        { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
        { table: 2, player1: { name: 'tutu' }, player2: { name: 'teuteu' } },
        { table: 1, player1: { name: 'tata' }, player2: { name: null } },
      ]],
      [{ reverse: false, by: 'table' }, [
        { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
        { table: 1, player1: { name: 'tata' }, player2: { name: null } },
        { table: 2, player1: { name: 'tutu' }, player2: { name: 'teuteu' } },
        { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
        { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
      ]],
      [{ reverse: true, by: 'table' }, [
        { table: 4, player1: { name: 'titi' }, player2: { name: 'tyty' } },
        { table: 3, player1: { name:   null }, player2: { name: 'toutou' } },
        { table: 2, player1: { name: 'tutu' }, player2: { name: 'teuteu' } },
        { table: 1, player1: { name: 'tata' }, player2: { name: null } },
        { table: null, player1: { name: 'toto' }, player2: { name: 'toti' } },
      ]],
    ]);
  });
});
