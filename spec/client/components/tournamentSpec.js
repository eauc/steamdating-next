import { beforeEach,
         context,
         it,
         spyOnService } from 'spec/client/helpers/helpers';

import { tournamentOpenHandler,
         tournamentOpenSuccessHandler,
         tournamentSetHandler,
         tournamentSetConfirmHandler,
         tournamentOnlineGetUrlsSuccessHandler,
         tournamentOnlineRefreshHandler,
         tournamentOnlineRefreshRequestHandler,
         tournamentOnlineRefreshSuccessHandler } from 'app/components/tournament/handler';

import fileService from 'app/services/file';
import stateService from 'app/services/state';
import tournamentsApiService from 'app/services/apis/tournaments';

describe('tournamentComponent', function() {
  beforeEach(function() {
    this.state = {};
    spyOnService(fileService, 'file');
    spyOnService(stateService, 'state');
    spyOnService(tournamentsApiService, 'tournamentsApi');
  });

  context('tournamentOpenHandler(<file>)', function() {
    return tournamentOpenHandler(this.state, ['file']);
  }, function() {
    it('should try to read <file>', function() {
      expect(fileService.readP)
        .toHaveBeenCalledWith('file');
    });

    context('when file read succeeds', function() {
      fileService.readP.resolveWith('data');
    }, function() {
      it('should set tournament to read data', function() {
        expect(stateService.dispatch)
          .toHaveBeenCalledWith(['tournament-openSuccess', 'data']);
      });
    });

    context('when file read fails', function() {
      fileService.readP.resolveWith(undefined);
    }, function() {
      it('should set error', function() {
        expect(stateService.dispatch)
          .toHaveBeenCalledWith(['toaster-set', {
            type: 'error',
            message: 'Invalid file'
          }]);
      });
    });
  });

  context('tournamentOpenSuccessHandler(<data>)', function() {
    return tournamentOpenSuccessHandler(this.state, ['data']);
  }, function() {
    it('should notify file loaded', function() {
      expect(stateService.dispatch)
        .toHaveBeenCalledWith(['toaster-set', {
          type: 'success',
          message: 'File loaded'
        }]);
    });

    it('should set tournament data', function() {
      expect(stateService.dispatch)
        .toHaveBeenCalledWith(['tournament-set', 'data']);
    });
  });

  context('tournamentSetHandler(<data>)', function() {
    return tournamentSetHandler(this.state, ['data']);
  }, function() {
    it('should prompt user for confirmation', function() {
      expect(stateService.dispatch)
        .toHaveBeenCalledWith([
          'prompt-set',
          { type: 'confirm',
            msg: 'All previous data will be replaced. You sure ?',
            onOk: ['tournament-setConfirm', 'data'] }
        ]);
    });
  });

  context('tournamentSetConfirmHandler(<data>)', function() {
    return tournamentSetConfirmHandler(this.state, ['data']);
  }, function() {
    it('should set <data> as current tournament', function() {
      expect(this.context)
        .toBe('data');
    });
  });

  context('tournamentOnlineGetUrlsSuccessHandler(<urls>)', function() {
    return tournamentOnlineGetUrlsSuccessHandler(this.state, ['urls']);
  }, function() {
    it('should set <urls> in current state', function() {
      expect(this.context)
        .toBe('urls');
    });
  });

  context('tournamentOnlineRefreshHandler()', function() {
    return tournamentOnlineRefreshHandler(this.state);
  }, function() {
    context('when online urls are not initialized', function() {
      this.state.online = { urls: null };
    }, function() {
      it('should get the urls', function() {
        expect(tournamentsApiService.getUrlsP)
          .toHaveBeenCalledWith({
            onSuccess: ['tournament-onlineGetUrlsSuccess']
          });
      });
    });

    context('when online urls are initialized', function() {
      this.state.online = { urls: 'urls' };
    }, function() {
      it('should not get the urls agains', function() {
        expect(tournamentsApiService.getUrlsP)
          .not.toHaveBeenCalled();
      });
    });

    it('should dispatch refreshRequest event', function() {
      expect(stateService.dispatch)
        .toHaveBeenCalledWith(['tournament-onlineRefreshRequest']);
    });
  });

  context('tournamentOnlineRefreshRequestHandler()', function() {
    return tournamentOnlineRefreshRequestHandler(this.state);
  }, function() {
    beforeEach(function() {
      this.state.online = {
        urls: 'urls',
        list: ['list']
      };
      this.state.auth = { token: 'token' };
    });

    it('should get online list for current user', function() {
      expect(tournamentsApiService.getMineP)
        .toHaveBeenCalledWith({
          urls: 'urls',
          authToken: 'token',
          onSuccess: ['tournament-onlineRefreshSuccess']
        });
    });

    it('should clear online list', function() {
      expect(this.context.online.list)
        .toEqual([]);
    });
  });

  context('tournamentOnlineRefreshSuccessHandler(<list>)', function() {
    return tournamentOnlineRefreshSuccessHandler(this.state, ['list']);
  }, function() {
    it('should set <list> in current state', function() {
      expect(this.context)
        .toBe('list');
    });
  });
});
