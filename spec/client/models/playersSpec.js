import { example } from 'spec/client/helpers/helpers';

import playersModel from 'app/models/players';

describe('playersModel', function () {
  describe('add(<new_player>)', function () {
    example(function (exple, desc) {
      it(`should add <new_player> to players, ${desc}`, function () {
        expect(playersModel.add(exple.new_player, exple.players))
          .toEqual(exple.result);
      });
    }, [
      ['players', 'new_player', 'result'],
      [[], { name: 'toto' }, [{ name: 'toto' }]],
      [[{ name: 'tata' },
        { name: 'titi' }],
       { name: 'toto' },
       [{ name: 'tata' },
        { name: 'titi' },
        { name: 'toto' }]],
      // name already exists -> noop
      [[{ name: 'tata', old: 'true' },
        { name: 'titi' }],
       { name: 'tata', new: 'true' },
       [{ name: 'tata', old:'true' },
        { name: 'titi' }]],
    ]);
  });

  describe('update(<name>, <update>)', function () {
    example(function (exple, desc) {
      it(`should update player <name> with <update> in players, ${desc}`, function () {
        expect(playersModel.update(exple.name, exple.update, exple.players))
          .toEqual(exple.result);
      });
    }, [
      ['players', 'name', 'update', 'result'],
      // when players empty -> noop
      [[], 'toto', { name: 'toto' }, []],
      // when <name> does not exits -> noop
      [[{ name: 'titi' },
        { name: 'tata' }],
       'toto', { name: 'toto' },
       [{ name: 'titi' },
        { name: 'tata' }]],
      // normal update
      [[{ name: 'titi', value: 'old' },
        { name: 'tata' }],
       'titi', { name: 'titi', value: 'new' },
       [{ name: 'titi', value: 'new' },
        { name: 'tata' }]],
      // change name
      [[{ name: 'titi', value: 'old' },
        { name: 'tata' }],
       'titi', { name: 'toto', value: 'new' },
       [{ name: 'toto', value: 'new' },
        { name: 'tata' }]],
    ]);
  });

  describe('remove(<name>)', function () {
    example(function (exple, desc) {
      it(`should remove players with <name> from players, ${desc}`, function () {
        expect(playersModel.remove(exple.name, exple.players))
          .toEqual(exple.result);
      });
    }, [
      ['players', 'name', 'result'],
      [[], 'toto', []],
      [[{ name: 'tata' },
        { name: 'titi' }],
       'tata',
       [{ name: 'titi' }]],
      [[{ name: 'tata' },
        { name: 'titi' },
        { name: 'tata' }],
       'tata',
       [{ name: 'titi' }]],
      // name does not exists -> noop
      [[{ name: 'tata' },
        { name: 'titi' }],
       'toto',
       [{ name: 'tata' },
        { name: 'titi' }]],
    ]);
  });

  describe('sort(<{reverse, by}>)', function () {
    example(function (exple, desc) {
      it(`should sort players, ${desc}`, function () {
        expect(playersModel.sort(exple.sort, exple.players))
          .toEqual(exple.result);
      });
    }, [
      ['players', 'sort', 'result'],
      [[], { by: 'whatever', reverse: true }, []],
      // simple sort : by name
      [[{ name: 'toto' },
        { name: 'tata' },
        { name: 'tutu' }],
       { by: 'name', reverse: false },
       [{ name: 'tata' },
        { name: 'toto' },
        { name: 'tutu' }]],
      [[{ name: 'toto' },
        { name: 'tata' },
        { name: 'tutu' }],
       { by: 'name', reverse: true },
       [{ name: 'tutu' },
        { name: 'toto' },
        { name: 'tata' }]],
      // sort by another prop
      [[{ name: 'toto', origin: 'Lyon' },
        { name: 'tata', origin: 'Paris' },
        { name: 'tutu', origin: 'Dijon' }],
       { by: 'origin', reverse: false },
       [{ name: 'tutu', origin: 'Dijon' },
        { name: 'toto', origin: 'Lyon' },
        { name: 'tata', origin: 'Paris' }]],
      [[{ name: 'toto', origin: 'Lyon' },
        { name: 'tata', origin: 'Paris' },
        { name: 'tutu', origin: 'Dijon' }],
       { by: 'origin', reverse: true },
       [{ name: 'tata', origin: 'Paris' },
        { name: 'toto', origin: 'Lyon' },
        { name: 'tutu', origin: 'Dijon' }]],
      // resolve equalities using name
      [[{ name: 'toto', origin: 'Lyon' },
        { name: 'titi', origin: 'Lyon' },
        { name: 'tata', origin: 'Paris' },
        { name: 'tutu', origin: 'Dijon' }],
       { by: 'origin', reverse: true },
       [{ name: 'tata', origin: 'Paris' },
        { name: 'toto', origin: 'Lyon' },
        { name: 'titi', origin: 'Lyon' },
        { name: 'tutu', origin: 'Dijon' }]],
      [[{ name: 'toto', origin: 'Lyon' },
        { name: 'titi', origin: 'Lyon' },
        { name: 'tata', origin: 'Paris' },
        { name: 'tutu', origin: 'Dijon' }],
       { by: 'origin', reverse: false },
       [{ name: 'tutu', origin: 'Dijon' },
        { name: 'titi', origin: 'Lyon' },
        { name: 'toto', origin: 'Lyon' },
        { name: 'tata', origin: 'Paris' }]],
    ]);
  });

  describe('filter(<filter>)', function () {
    beforeEach(function () {
      this.players = [
        { name: 'tata', origin: 'Lyon', faction: 'Cryx' },
        { name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
        { name: 'titi', origin: 'Paris', faction: 'Khador' },
        { name: 'tutu', origin: 'Lyon', faction: 'Khador' },
      ];
    });

    example(function ({ filterRegExp, list, columns }, desc) {
      it(`should filter players matching <filter>, ${desc}`, function () {
        expect(playersModel.filter({ filterRegExp }, this.players))
          .toEqual({ list, columns });
      });
    }, [
      ['filterRegExp', 'list', 'columns'],
      // no filter -> everything matches
      [/.*/, [{ name: 'tata', origin: 'Lyon', faction: 'Cryx' },
              { name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
              { name: 'titi', origin: 'Paris', faction: 'Khador' },
              { name: 'tutu', origin: 'Lyon', faction: 'Khador' },
             ], ['name','origin','faction','lists']],
      // nothing matches
      [/toto/i, [], ['name','origin','faction','lists']],
      // matches name
      [/tete/i, [{ name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
                ], ['name','origin','faction','lists']],
      [/tete|toto/i, [{ name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
                     ], ['name','origin','faction','lists']],
      [/tutu|tete/i, [{ name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
                      { name: 'tutu', origin: 'Lyon', faction: 'Khador' },
                     ], ['name','origin','faction','lists']],
      // matches another column, sort this column first after name
      [/cyg/i, [{ name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
               ], ['name', 'faction','origin','lists']],
      [/cyg|toto/i, [{ name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
                    ], ['name', 'faction','origin','lists']],
      [/Khad|Cyg/i, [{ name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
                     { name: 'titi', origin: 'Paris', faction: 'Khador' },
                     { name: 'tutu', origin: 'Lyon', faction: 'Khador' },
                    ], ['name', 'faction', 'origin', 'lists']],
      // matches multiple columns
      [/dij|cyg/i, [{ name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
                   ], ['name', 'origin', 'faction', 'lists']],
      [/kha|dijon/i, [{ name: 'tete', origin: 'Dijon', faction: 'Cygnar' },
                      { name: 'titi', origin: 'Paris', faction: 'Khador' },
                      { name: 'tutu', origin: 'Lyon', faction: 'Khador' },
                     ], ['name', 'origin', 'faction','lists']],
    ]);
  });

  describe('names()', function () {
    beforeEach(function () {
      this.players = [
        { name: 'toto' },
        { name: 'titi' },
        { name: 'tutu' },
        { name: 'tata' },
        { name: 'tete' },
      ];
    });

    it('should return sorted players names', function () {
      expect(playersModel.names(this.players))
        .toEqual([
          'tata',
          'tete',
          'titi',
          'toto',
          'tutu',
        ]);
    });
  });

  describe('factions()', function () {
    beforeEach(function () {
      this.players = [
        { name: 'toto', faction: 'khador' },
        { name: 'titi', faction: 'legion' },
        { name: 'tutu', faction: 'menoth' },
        { name: 'tata', faction: 'cryx' },
        { name: 'tete', faction: 'cyriss' },
      ];
    });

    it('should return players-factions object', function () {
      expect(playersModel.factions(this.players))
        .toEqual({
          tata: 'cryx',
          tete: 'cyriss',
          titi: 'legion',
          toto: 'khador',
          tutu: 'menoth',
        });
    });
  });
});
