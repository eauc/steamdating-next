import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import authModel from 'app/models/auth';

describe('authModel', function () {
  beforeEach(function () {
    this.auth = authModel.create();
  });

  context('authCreate()', function () {
    return authModel.create();
  }, function () {
    it('should be created inactive', function () {
      expect(authModel.isActive(this.context))
        .toBe(false);
    });

    it('should reset token', function () {
      expect(authModel.getToken(this.context))
        .toBe(null);
    });
  });

  context('setToken(<token>)', function () {
    return authModel.setToken(this.token, this.auth);
  }, function () {
    context('when <token> is invalid', function () {
      this.token = '';
    }, function () {
      it('should be inactive', function () {
        expect(authModel.isActive(this.context))
          .toBe(false);
      });
    });

    context('when <token> is valid', function () {
      this.token = 'token';
    }, function () {
      it('should be active', function () {
        expect(authModel.isActive(this.context))
          .toBe(true);
      });

      it('should store token', function () {
        expect(authModel.getToken(this.context))
          .toBe(this.token);
      });
    });
  });

  context('reset()', function () {
    return authModel.reset(this.auth);
  }, function () {
    beforeEach(function () {
      authModel.setToken('token', this.auth);
    });

    it('should be inactive', function () {
      expect(authModel.isActive(this.context))
        .toBe(false);
    });

    it('should reset token', function () {
      expect(authModel.getToken(this.context))
        .toBe(null);
    });
  });
});
