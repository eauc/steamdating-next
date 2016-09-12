import { beforeEach,
         it } from 'spec/client/helpers/helpers';

import { authSignoutHandler,
         authSetTokenHandler } from 'app/components/auth/handler';

describe('authComponent', function() {
  beforeEach(function() {
    this.state = {};
  });

  describe('authSetTokenHandler(<token>)', function() {
    it('should set token field', function() {
      expect(authSetTokenHandler({}, ['token']))
        .toEqual({ token: 'token' });
    });
  });

  describe('authSignoutHandler()', function() {
    it('should clear token field', function() {
      expect(authSignoutHandler({ token: 'token' }))
        .toEqual({ token: null });
    });
  });
});
