import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { promptUpdateValueHandler,
         promptOkHandler,
         promptCancelHandler } from 'app/components/prompt/handler';

describe('promptComponent', function () {
  beforeEach(function () {
    this.state = {};
  });

  context('promptUpdateValueHandler(<value>)', function () {
    return promptUpdateValueHandler(this.state, { value: 'value' });
  }, function () {
    it('should setup prompt with <value>', function () {
      expect(this.context)
        .toEqual({ value: 'value' });
    });
  });

  context('promptOkHandler()', function () {
    return promptOkHandler(this.state);
  }, function () {
    beforeEach(function () {
      this.state.onOk = { eventName: 'on-ok-event' };
    });

    it('should reset prompt', function () {
      expect(this.context.state).toBe(null);
    });

    it('should dispatch <prompt.onOk> event', function () {
      expect(this.context.dispatch)
        .toEqual({ eventName: 'on-ok-event' });
    });

    context('when type==="prompt"', function () {
      this.state.type = 'prompt';
      this.state.value = 42;
    }, function () {
      it('should append <prompt.value> to event', function () {
        expect(this.context.dispatch)
          .toEqual({ eventName: 'on-ok-event', value: 42 });
      });
    });
  });

  context('promptCancelHandler()', function () {
    return promptCancelHandler(this.state);
  }, function () {
    it('should reset prompt', function () {
      expect(this.context.state).toBe(null);
    });

    context('when <promp.onCancel> is defined', function () {
      this.state.onCancel = { eventName: 'on-cancel-event', payload: 'value' };
    }, function () {
      it('should dispatch <prompt.onCancel> event', function () {
        expect(this.context.dispatch)
          .toEqual({ eventName: 'on-cancel-event', payload: 'value' });
      });
    });
  });
});
