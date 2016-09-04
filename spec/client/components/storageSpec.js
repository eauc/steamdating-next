import { beforeEach,
         context,
         it,
         spyOnService } from 'spec/client/helpers/helpers';

import { storageRefreshHandler } from 'app/components/storage/handler';
import { storageUpdate } from 'app/components/storage/sub';
import { storageListener,
         storageInit,
         STATE_STORAGE_KEY } from 'app/components/storage/state';
import appStateService from 'app/services/state';

describe('storageComponent', function() {
  beforeEach(function() {
    this.state = {
      value: { unchanged: true },
      override: false
    };
    spyOnService(appStateService, 'appState');
  });

  context('storageInit()', function() {
    return storageInit(this.state);
  }, function() {
    beforeEach(function() {
      spyOn(self.localStorage, 'getItem')
        .and.returnValue(JSON.stringify({
          value: { refresh: true },
          override: true
        }));
    });

    it('shoud read stored state', function() {
      expect(self.localStorage.getItem)
        .toHaveBeenCalledWith(STATE_STORAGE_KEY);
    });

    it('shoud return merged state', function() {
      expect(this.context)
        .toEqual({
          override: true,
          value: { refresh: true,
                   unchanged: true
                 }
        });
    });
  });

  context('storageListener(<event>)', function() {
    return storageListener(this.event);
  }, function() {
    beforeEach(function() {
      this.event = {};
    });

    context('when the updated key is not the state key', function() {
      this.event.key = 'other';
    }, function() {
      it('should not refresh state', function() {
        expect(appStateService.dispatch)
          .not.toHaveBeenCalled();
      });
    });

    context('when the updated key is the state key', function() {
      this.event.key = STATE_STORAGE_KEY;
      this.event.newValue = JSON.stringify({ value: 'new' });
    }, function() {
      it('should refresh state', function() {
        expect(appStateService.dispatch)
          .toHaveBeenCalledWith(['storage-refresh', { value: 'new' }]);
      });
    });
  });

  context('storageRefreshHandler(<refresh>)', function() {
    return storageRefreshHandler(this.state, [ {
      value: { refresh: true },
      override: true
    } ]);
  }, function() {
    it('should merge current state with refresh', function() {
      expect(this.context).toEqual({
        override: true,
        value: { refresh: true,
                 unchanged: true
               }
      });
    });
  });

  context('storageUpdate(<refresh>)', function() {
    return storageUpdate(this.state);
  }, function() {
    beforeEach(function() {
      spyOn(self.localStorage, 'setItem');
      storageUpdate(this.state);
      storageUpdate(this.state);
    });

    it('should store current state', function() {
      expect(self.localStorage.setItem)
        .toHaveBeenCalledWith(STATE_STORAGE_KEY, JSON.stringify(this.state));
    });
  });
});
