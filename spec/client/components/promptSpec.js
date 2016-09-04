import { beforeEach,
         context,
         it,
         spyOnService } from 'spec/client/helpers/helpers';

import { promptUpdateValueHandler,
         promptOkHandler,
         promptCancelHandler } from 'app/components/prompt/handler';
import appStateService from 'app/services/state';

describe('promptComponent', function() {
  beforeEach(function() {
    this.state = {};
    spyOnService(appStateService, 'state');
  });

  context('promptUpdateValueHandler(<value>)', function() {
    return promptUpdateValueHandler(this.state, ['value']);
  }, function() {
    it('should setup form <name> with <value>', function() {
      expect(this.context)
        .toEqual({ value: 'value' });
    });
  });

  context('promptOkHandler()', function() {
    return promptOkHandler(this.state);
  }, function() {
    beforeEach(function() {
      this.state.onOk = ['on-ok-event'];
    });

    it('should reset prompt', function() {
      expect(this.context).toBe(null);
    });

    it('should dispatch <prompt.onOk> event', function() {
      expect(appStateService.dispatch)
        .toHaveBeenCalledWith(['on-ok-event']);
    });

    context('when type==="prompt"', function() {
      this.state.type = 'prompt';
      this.state.value = 42;
    }, function() {
      it('should append <prompt.value> to event', function() {
        expect(appStateService.dispatch)
          .toHaveBeenCalledWith(['on-ok-event', 42]);
      });
    });
  });

  context('promptCancelHandler()', function() {
    return promptCancelHandler(this.state);
  }, function() {
    it('should reset prompt', function() {
      expect(this.context).toBe(null);
    });

    context('when <promp.onCancel> is defined', function() {
      this.state.onCancel = ['on-cancel-event', 'value'];
    }, function() {
      it('should dispatch <prompt.onCancel> event', function() {
        expect(appStateService.dispatch)
          .toHaveBeenCalledWith(['on-cancel-event', 'value']);
      });
    });
  });
});
