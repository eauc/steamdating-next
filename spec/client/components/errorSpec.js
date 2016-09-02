import { beforeEach,
         context,
         it,
         spyOnService } from 'spec/client/helpers/helpers';

import { errorClearHandler,
         errorSetHandler } from 'app/components/error/handler';
import appStateService from 'app/services/state';

describe('errorComponent', function() {
  beforeEach(function() {
    this.state = {};
    spyOn(self, 'setTimeout')
      .and.callFake((f) => f());
    spyOnService(appStateService, 'appState');
  });

  describe('errorClearHandler()', function() {
    it('should clear error field', function() {
      expect(errorClearHandler()).toBe(null);
    });
  });

  context('errorSetHandler()', function() {
    return errorSetHandler(this.state, ['msg']);
  }, function() {
    it('should set error field', function() {
      expect(this.context).toBe('msg');
    });

    it('should schedule "error-clear"', function() {
      expect(self.setTimeout)
        .toHaveBeenCalledWith(jasmine.any(Function), 1000);
      expect(appStateService.dispatch)
        .toHaveBeenCalledWith(['error-clear']);
    });
  });
});
