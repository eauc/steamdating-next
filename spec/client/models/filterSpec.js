import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import filterModel from 'app/models/filter';

describe('filterModel', function () {
  beforeEach(function () {
    this.filter = {};
  });

  context('filterSetHandler(<name>, <value>)', function () {
    return filterModel.set('name', 'value', this.filter);
  }, function () {
    it('should store filter <name>\'s <value>', function () {
      expect(filterModel.get('name', this.context))
        .toBe('value');
    });
  });
});
