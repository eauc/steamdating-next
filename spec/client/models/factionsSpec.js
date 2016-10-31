import { context,
         it } from 'spec/client/helpers/helpers';

import factionsModel from 'app/models/factions';

describe('factionsModel', function () {
  beforeEach(function () {
    this.factions = {
      faction1: { casters: { caster11: 'caster11Name',
                             caster12: 'caster12Name',
                           },
                  icon: 'icon1',
                },
      faction2: { casters: { caster21: 'caster21Name',
                             caster22: 'caster22Name',
                           },
                  icon: 'icon2',
                },
    };
  });

  context('iconFor(<name>)', function () {
    return factionsModel.iconFor(this.name, this.factions);
  }, function () {
    context('when <name> exists', function () {
      this.name = 'faction2';
    }, function () {
      it('should return icon path for <name>', function () {
        expect(this.context).toBe('/data/icons/icon2');
      });
    });
  });

  context('castersFor(<name>)', function () {
    return factionsModel.castersFor(this.name, this.factions);
  }, function () {
    context('when <name> exists', function () {
      this.name = 'faction2';
    }, function () {
      it('should return casters names for <name>', function () {
        expect(this.context)
          .toEqual(['caster21', 'caster22']);
      });
    });

    context('when <name> doesn\'t exists', function () {
      this.name = '';
    }, function () {
      it('should return empty list', function () {
        expect(this.context)
          .toEqual([]);
      });
    });
  });
});
