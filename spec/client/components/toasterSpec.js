import { beforeEach,
         context,
         it,
         spyOnService } from 'spec/client/helpers/helpers';

import { toasterClearHandler,
         toasterSetHandler } from 'app/components/toaster/handler';
import appStateService from 'app/services/state';

describe('toasterComponent', function () {
  beforeEach(function () {
    this.state = {};
    spyOn(self, 'setTimeout')
      .and.callFake((fun) => fun());
    spyOnService(appStateService, 'appState');
  });

  describe('toasterClearHandler()', function () {
    it('should clear toaster field', function () {
      expect(toasterClearHandler()).toBe(null);
    });
  });

  context('toasterSetHandler(<msg>)', function () {
    return toasterSetHandler(this.state, [{ type: 'error', message: 'msg' }]);
  }, function () {
    it('should set toaster field', function () {
      expect(this.context).toEqual({ type: 'error', message: 'msg' });
    });

    it('should schedule "toaster-clear"', function () {
      expect(self.setTimeout)
        .toHaveBeenCalledWith(jasmine.any(Function), 1000);
      expect(appStateService.dispatch)
        .toHaveBeenCalledWith(['toaster-clear']);
    });
  });
});
