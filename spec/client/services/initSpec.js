import R from 'app/helpers/ramda';
import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { initHandler,
         registerInit } from 'app/services/init';

describe('initService', function() {
  beforeEach(function() {
    this.init1 = jasmine.createSpy('init1')
      .and.callFake((s) => R.assoc('init1', true, s));
    this.init2 = jasmine.createSpy('init2')
      .and.callFake((s) => R.assoc('init2', true, s));

    registerInit('init1', this.init1);
    registerInit('init2', this.init2);
  });

  context('initHandler()', function() {
    return initHandler();
  }, function() {
    it('should reduce initializers', function() {
      expect(this.context).toEqual({ init1: true, init2: true });

      expect(this.init1).toHaveBeenCalled();
      expect(this.init2).toHaveBeenCalled();
    });
  });
});
