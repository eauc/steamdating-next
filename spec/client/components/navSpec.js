import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { navigateHandler,
         navigateBackHandler,
       } from 'app/components/nav/handler';

describe('navComponent', function () {
  beforeEach(function () {
    this.history = jasmine.createSpyObj('history', [
      'goBack', 'push',
    ]);
  });

  context('navigateHandler({ to })', function () {
    return navigateHandler({ history: this.history }, { to: 'to' });
  }, function () {
    it('should push "to" in nav history', function () {
      expect(this.history.push)
        .toHaveBeenCalledWith('to');
    });
  });

  context('navigateBackHandler()', function () {
    return navigateBackHandler({ history: this.history });
  }, function () {
    it('should go back in nav history', function () {
      expect(this.history.goBack)
        .toHaveBeenCalled();
    });
  });
});
