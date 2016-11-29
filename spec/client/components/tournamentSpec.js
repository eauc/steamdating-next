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
         tournamentOnlineRefreshSuccessHandler,
         tournamentOnlineSaveHandler,
         tournamentOnlineSaveSuccessHandler,
         tournamentOnlineDownloadHandler,
         tournamentOnlineDownloadSuccessHandler,
       } from 'app/components/tournament/handler';

import fileService from 'app/services/file';
import tournamentsApiService from 'app/services/apis/tournaments';

describe('tournamentComponent', function () {
  beforeEach(function () {
    this.state = {};
    spyOnService(fileService, 'file');
    spyOnService(tournamentsApiService, 'tournamentsApi');
  });

  context('tournamentOpenHandler(<file>)', function () {
    return tournamentOpenHandler(this.state, ['file']);
  }, function () {
    it('should try to read <file>', function () {
      expect(fileService.readP)
        .toHaveBeenCalledWith('file');
    });

    context('when file read succeeds', function () {
      fileService.readP.resolveWith('data');
    }, function () {
      it('should set tournament to read data', function () {
        return this.context.dispatch.then((event) => {
          expect(event)
            .toEqual(['tournament-openSuccess', 'data']);
        });
      });
    });

    context('when file read fails', function () {
      fileService.readP.resolveWith(undefined);
    }, function () {
      it('should set error', function () {
        return this.context.dispatch.then((event) => {
          expect(event)
            .toEqual(['toaster-set', {
              type: 'error',
              message: 'Invalid file',
            }]);
        });
      });
    });
  });

  context('tournamentOpenSuccessHandler(<data>)', function () {
    return tournamentOpenSuccessHandler(this.state, ['data']);
  }, function () {
    it('should notify file loaded', function () {
      expect(this.context.dispatch)
        .toContain(['toaster-set', { type: 'success', message: 'File loaded' }]);
    });

    it('should set tournament data', function () {
      expect(this.context.dispatch)
        .toContain(['tournament-set', 'data']);
    });
  });

  context('tournamentSetHandler(<data>)', function () {
    return tournamentSetHandler(this.state, ['data']);
  }, function () {
    it('should prompt user for confirmation', function () {
      expect(this.context.dispatch)
        .toEqual([
          'prompt-set',
          { type: 'confirm',
            msg: 'All previous data will be replaced. You sure ?',
            onOk: ['tournament-setConfirm', 'data'] },
        ]);
    });
  });

  context('tournamentSetConfirmHandler(<data>)', function () {
    return tournamentSetConfirmHandler(this.state, ['data']);
  }, function () {
    it('should set <data> as current tournament', function () {
      expect(this.context)
        .toBe('data');
    });
  });

  context('tournamentOnlineGetUrlsSuccessHandler(<urls>)', function () {
    return tournamentOnlineGetUrlsSuccessHandler(this.state, ['urls']);
  }, function () {
    it('should set <urls> in current state', function () {
      expect(this.context)
        .toBe('urls');
    });
  });

  context('tournamentOnlineRefreshHandler()', function () {
    return tournamentOnlineRefreshHandler(this.state);
  }, function () {
    context('when online urls are not initialized', function () {
      this.state.online = { urls: null };
    }, function () {
      it('should get the urls', function () {
        expect(tournamentsApiService.getUrlsP)
          .toHaveBeenCalledWith({
            onSuccess: ['tournament-onlineGetUrlsSuccess'],
          });
      });
    });

    context('when online urls are initialized', function () {
      this.state.online = { urls: 'urls' };
    }, function () {
      it('should not get the urls agains', function () {
        expect(tournamentsApiService.getUrlsP)
          .not.toHaveBeenCalled();
      });
    });

    it('should dispatch refreshRequest event', function () {
      this.context.dispatch.then((event) => {
        expect(event)
          .toEqual(['tournament-onlineRefreshRequest']);
      });
    });
  });

  context('tournamentOnlineRefreshRequestHandler()', function () {
    return tournamentOnlineRefreshRequestHandler(this.state);
  }, function () {
    beforeEach(function () {
      this.state.online = {
        urls: 'urls',
        list: ['list'],
      };
      this.state.auth = { token: 'token' };
    });

    it('should get online list for current user', function () {
      expect(tournamentsApiService.getMineP)
        .toHaveBeenCalledWith({
          urls: 'urls',
          authToken: 'token',
          onSuccess: ['tournament-onlineRefreshSuccess'],
        });
    });
  });

  context('tournamentOnlineRefreshSuccessHandler(<list>)', function () {
    return tournamentOnlineRefreshSuccessHandler(this.state, [this.newList]);
  }, function () {
    beforeEach(function () {
      this.state = ['tournament1', 'tournament2'];
      this.newList = ['tournament1','tournament3','tournament4'];
    });

    it('should update <list> in current state', function () {
      expect(this.context)
        .toEqual(this.newList);
    });
  });

  context('tournamentOnlineSaveHandler(<form>)', function () {
    return tournamentOnlineSaveHandler(this.state, [this.form]);
  }, function () {
    beforeEach(function () {
      this.state = {
        auth: { token: 'token' },
        online: { urls: 'urls' },
        tournament: { players: ['players'] },
      };
      this.form = {
        edit: { name: 'name',
                date: 'date',
              },
      };
    });

    it('should save current tournament on server', function () {
      expect(tournamentsApiService.saveP)
        .toHaveBeenCalledWith({
          urls: 'urls',
          authToken: 'token',
          tournament: { players: ['players'],
                        online: { name: 'name', date: 'date' },
                      },
          onSuccess: ['tournament-onlineSaveSuccess'],
        });
    });
  });

  context('tournamentOnlineSaveSuccessHandler(<tournament>)', function () {
    return tournamentOnlineSaveSuccessHandler(this.state, ['tournament']);
  }, function () {
    it('should display save success toaster & refresh online list', function () {
      expect(this.context.dispatch)
        .toContain(['toaster-set', { type: 'success', message: 'Tournament saved online' }]);
    });

    it('should refresh online list', function () {
      expect(this.context.dispatch)
        .toContain(['tournament-onlineRefresh']);
    });

    it('should update <state>\'s tournament', function () {
      expect(this.context.state)
        .toBe('tournament');
    });
  });

  context('tournamentOnlineDownloadHandler(<tournament>)', function () {
    return tournamentOnlineDownloadHandler(this.state, ['tournament']);
  }, function () {
    beforeEach(function () {
      this.state = {
        auth: { token: 'token' },
      };
    });

    it('should load tournament from server', function () {
      expect(tournamentsApiService.loadP)
        .toHaveBeenCalledWith({
          authToken: 'token',
          tournament: 'tournament',
          onSuccess: ['tournament-onlineDownloadSuccess'],
        });
    });
  });

  context('tournamentOnlineDownloadSuccessHandler(<tournament>)', function () {
    return tournamentOnlineDownloadSuccessHandler(this.state, ['tournament']);
  }, function () {
    it('should display save success toaster', function () {
      expect(this.context.dispatch)
        .toContain(['toaster-set', { type: 'success', message: 'Tournament loaded' }]);
    });

    it('should set local tournament', function () {
      expect(this.context.dispatch)
        .toContain(['toaster-set', { type: 'success', message: 'Tournament loaded' }]);
    });
  });
});
