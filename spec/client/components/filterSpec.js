import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { filterSetHandler } from 'app/components/filter/handler';

describe('filterComponent', function() {
  beforeEach(function() {
    this.state = {};
  });

  context('filterSetHandler(<name>, <value>)', function() {
    return filterSetHandler(this.state, ['name', 'value']);
  }, function() {
    it('should set filter field <name> with <value>', function() {
      expect(this.context).toEqual({name: 'value'});
    });
  });
});
