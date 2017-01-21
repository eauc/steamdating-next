import { beforeEach,
         context,
         example,
         it } from 'spec/client/helpers/helpers';

import filterModel from 'app/models/filter';

describe('filterModel', function () {
  beforeEach(function () {
    this.filter = {};
  });

  context('filterSet(<name>, <value>)', function () {
    return filterModel.set('name', 'value', this.filter);
  }, function () {
    it('should store filter <name>\'s <value>', function () {
      expect(filterModel.get('name', this.context))
        .toBe('value');
    });
  });

  describe('filterGetRegExp(<name>)', function () {
    example(function ({ value, regExp }, desc) {
      it(`should convert filter's value ro regExp, ${desc}`, function () {
        const filter = filterModel.set('name', value, {});
        expect(filterModel.getRegExp('name', filter))
          .toEqual(regExp);
      });
    }, [
      ['value', 'regExp'],
      ['', /.*/i],
      ['toto', /toto/i],
      ['toto titi', /toto|titi/i],
    ]);
  });
});
