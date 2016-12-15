import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { initHandler,
         registerInit,
         resetInitializers } from 'app/services/init';

describe('initService', function () {
  beforeEach(function () {
    resetInitializers();

    registerInit('storage-init', []);
    registerInit('init1', []);
    registerInit('init2', []);
  });

  context('initHandler()', function () {
    return initHandler();
  }, function () {
    it('should dispatch all registered init events, storage last', function () {
      expect(this.context)
        .toEqual({
          dispatch: [
            { eventName: 'init1' },
            { eventName: 'init2' },
            { eventName: 'storage-init' },
          ],
        });
    });

    context('when initializers depend on each other', function () {
      registerInit('init1', ['init2']);
    }, function () {
      it('should call dependencies first', function () {
        expect(this.context)
          .toEqual({
            dispatch: [
              { eventName: 'init2' },
              { eventName: 'init1' },
              { eventName: 'storage-init' },
            ],
          });
      });

      context('when there is a circular dependency', function () {
        registerInit('init2', ['init1']);
      }, function () {
        it('should not fail miserably', function () {
          expect(this.context)
            .toEqual({
              dispatch: [
                { eventName: 'init2' },
                { eventName: 'init1' },
                { eventName: 'storage-init' },
              ],
            });
        });
      });
    });

    context('when initializers depend on storage', function () {
      registerInit('init1', ['init2', 'storage-init']);
    }, function () {
      it('should call those initializers after storage', function () {
        expect(this.context)
          .toEqual({
            dispatch: [
              { eventName: 'init2' },
              { eventName: 'storage-init' },
              { eventName: 'init1' },
            ],
          });
      });
    });
  });
});
