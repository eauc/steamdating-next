import R from 'app/helpers/ramda';
import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { initHandler,
         registerInit,
         resetInitializers } from 'app/services/init';

describe('initService', function () {
  beforeEach(function () {
    resetInitializers();

    this.init1 = jasmine.createSpy('init1')
      .and.callFake(R.assoc('init1', true));
    this.init2 = jasmine.createSpy('init2')
      .and.callFake(R.assoc('init2', true));
    this.storage = jasmine.createSpy('storage')
      .and.callFake(R.assoc('storage', true));

    registerInit('init1', [], this.init1);
    registerInit('init2', [], this.init2);
    registerInit('storage', [], this.storage);
  });

  context('initHandler()', function () {
    return initHandler();
  }, function () {
    it('should reduce initializers', function () {
      expect(this.context)
        .toEqual({ init1: true, init2: true, storage: true });

      expect(this.init1).toHaveBeenCalled();
      expect(this.init2).toHaveBeenCalled();
    });

    it('should call storage initializer after other intializers', function () {
      expect(this.storage)
        .toHaveBeenCalledWith({ init1: true, init2: true });
    });

    context('when initializers depend on each other', function () {
      registerInit('init1', ['init2'], this.init1);
    }, function () {
      it('should call dependencies first', function () {
        expect(this.init2).toHaveBeenCalledWith({});
        expect(this.init1).toHaveBeenCalledWith({ init2: true });
      });

      context('when there is a circular dependency', function () {
        registerInit('init2', ['init1'], this.init2);
      }, function () {
        it('should not fail miserably', function () {
          expect(this.init2).toHaveBeenCalledWith({});
          expect(this.init1).toHaveBeenCalledWith({ init2: true });
        });
      });
    });

    context('when initializers depend on storage', function () {
      registerInit('init1', ['init2', 'storage'], this.init1);
    }, function () {
      it('should call those initializers after storage', function () {
        expect(this.init2).toHaveBeenCalledWith({});
        expect(this.storage).toHaveBeenCalledWith({ init2: true });
        expect(this.init1).toHaveBeenCalledWith({ init2: true, storage: true });
      });
    });
  });
});
