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
         tournamentOnlineRefreshErrorHandler,
         tournamentOnlineSaveHandler,
         tournamentOnlineSaveSuccessHandler,
         tournamentOnlineDownloadHandler,
         tournamentOnlineDownloadSuccessHandler,
       } from 'app/components/tournament/handler';

import fileService from 'app/services/file';

describe('tournamentComponent', function () {
  beforeEach(function () {
    this.state = {};
    spyOnService(fileService, 'file');
  });

  context('tournamentSetHandler(<data>)', function () {
    return tournamentSetHandler(this.state, { tournament: 'data' });
  }, function () {
    it('should prompt user for confirmation', function () {
      expect(this.context.dispatch)
        .toEqual({
          eventName: 'prompt-set',
          type: 'confirm',
          msg: 'All previous data will be replaced. You sure ?',
          onOk: { eventName: 'tournament-setConfirm', tournament: 'data' },
        });
    });
  });

  context('tournamentSetConfirmHandler(<data>)', function () {
    return tournamentSetConfirmHandler(this.state, { tournament: 'data' });
  }, function () {
    it('should set <data> as current tournament', function () {
      expect(this.context)
        .toBe('data');
    });
  });

  context('tournamentOpenHandler(<file>)', function () {
    return tournamentOpenHandler(this.state, { file: 'file' });
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
            .toEqual({ eventName: 'tournament-openSuccess', data: 'data' });
        });
      });
    });

    context('when file read fails', function () {
      fileService.readP.resolveWith(undefined);
    }, function () {
      it('should set error', function () {
        return this.context.dispatch.then((event) => {
          expect(event)
            .toEqual({
              eventName: 'toaster-set',
              type: 'error',
              message: 'Invalid file',
            });
        });
      });
    });
  });

  context('tournamentOpenSuccessHandler(<data>)', function () {
    return tournamentOpenSuccessHandler(this.state, { data: 'data' });
  }, function () {
    it('should notify file loaded', function () {
      expect(this.context.dispatch)
        .toContain({
          eventName: 'toaster-set',
          type: 'success',
          message: 'File loaded',
        });
    });

    it('should set tournament data', function () {
      expect(this.context.dispatch)
        .toContain({ eventName: 'tournament-set', tournament: 'data' });
    });
  });

  context('tournamentOnlineGetUrlsSuccessHandler(<urls>)', function () {
    return tournamentOnlineGetUrlsSuccessHandler(this.state, { urls: 'urls' });
  }, function () {
    it('should set <urls> in current state', function () {
      expect(this.context.state)
        .toBe('urls');
    });

    it('should refresh online list', function () {
      expect(this.context.dispatch)
        .toEqual({ eventName: 'tournament-onlineRefreshRequest' });
    });
  });

  context('tournamentOnlineRefreshHandler()', function () {
    return tournamentOnlineRefreshHandler(this.state);
  }, function () {
    context('when online urls are not initialized', function () {
      this.state.online = { urls: null };
    }, function () {
      it('should get the urls', function () {
        expect(this.context)
          .toEqual({
            http: {
              method: 'GET',
              onError: { eventName: 'tournament-onlineRefreshError' },
              onSuccess: jasmine.any(Function),
              url: '/api/tournaments',
            },
          });
      });
    });

    context('when online urls are initialized', function () {
      this.state.online = { urls: 'urls' };
    }, function () {
      it('should refresh online list', function () {
        expect(this.context)
          .toEqual({ dispatch: { eventName: 'tournament-onlineRefreshRequest' } });
      });
    });
  });

  context('tournamentOnlineRefreshRequestHandler()', function () {
    return tournamentOnlineRefreshRequestHandler(this.state);
  }, function () {
    beforeEach(function () {
      this.state.online = {
        urls: { mine: '/mine' },
        list: ['list'],
      };
      this.state.auth = { token: 'token' };
    });

    it('should get online list for current user', function () {
      expect(this.context)
        .toEqual({
          http: {
            headers: { Authorization: 'Bearer token' },
            method: 'GET',
            onError: { eventName: 'tournament-onlineRefreshError' },
            onSuccess: jasmine.any(Function),
            url: '/api/tournaments/mine',
          },
        });
    });
  });

  context('tournamentOnlineRefreshSuccessHandler(<list>)', function () {
    return tournamentOnlineRefreshSuccessHandler(this.state, {
      tournaments: this.newList,
    });
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

  context('tournamentOnlineRefreshErrorHandler()', function () {
    return tournamentOnlineRefreshErrorHandler();
  }, function () {
    it('should reset online list', function () {
      expect(this.context.state)
        .toEqual([]);
    });

    it('should display error message', function () {
      expect(this.context.dispatch)
        .toEqual({
          eventName: 'toaster-set',
          type: 'error',
          message: 'Error loading tournaments from server',
        });
    });
  });

  context('tournamentOnlineSaveHandler(<form>)', function () {
    return tournamentOnlineSaveHandler(this.state, { form: this.form });
  }, function () {
    beforeEach(function () {
      this.state = {
        auth: { token: 'token' },
        online: { urls: { mine: '/mine' } },
        tournament: { players: ['players'] },
      };
      this.form = {
        edit: {
          name: 'name',
          date: 'date',
        },
      };
    });

    it('should save current tournament on server', function () {
      expect(this.context)
        .toEqual({
          http: {
            data: {
              data: '{"players":["players"],"online":{"name":"name","date":"date"}}',
              date: 'date',
              name: 'name',
            },
            headers: { Authorization: 'Bearer token' },
            method: 'POST',
            onError: {
              eventName: 'toaster-set',
              message: 'Error saving tournament on server',
              type: 'error',
            },
            onSuccess: jasmine.any(Function),
            url: '/api/tournaments/mine',
          },
        });
    });
  });

  context('tournamentOnlineSaveSuccessHandler(<tournament>)', function () {
    return tournamentOnlineSaveSuccessHandler(this.state, { tournament: 'tournament' });
  }, function () {
    it('should display save success toaster & refresh online list', function () {
      expect(this.context.dispatch)
        .toContain({
          eventName: 'toaster-set',
          type: 'success',
          message: 'Tournament saved online',
        });
    });

    it('should refresh online list', function () {
      expect(this.context.dispatch)
        .toContain({ eventName: 'tournament-onlineRefresh' });
    });

    it('should update <state>\'s tournament', function () {
      expect(this.context.state)
        .toBe('tournament');
    });
  });

  context('tournamentOnlineDownloadHandler(<tournament>)', function () {
    return tournamentOnlineDownloadHandler(this.state, {
      tournament: this.tournament,
    });
  }, function () {
    beforeEach(function () {
      this.state = {
        auth: { token: 'token' },
      };
      this.tournament = {
        link: '/link',
      };
    });

    it('should load tournament from server', function () {
      expect(this.context)
        .toEqual({
          http: {
            headers: { Authorization: 'Bearer token' },
            method: 'GET',
            onError: {
              eventName: 'toaster-set',
              type: 'error',
              message: 'Error loading tournament from server',
            },
            onSuccess: jasmine.any(Function),
            url: '/api/tournaments/link',
          },
        });
    });
  });

  context('tournamentOnlineDownloadSuccessHandler(<tournament>)', function () {
    return tournamentOnlineDownloadSuccessHandler(this.state, ['tournament']);
  }, function () {
    it('should display save success toaster', function () {
      expect(this.context.dispatch)
        .toContain({
          eventName: 'toaster-set',
          type: 'success',
          message: 'Tournament loaded',
        });
    });

    it('should set local tournament', function () {
      expect(this.context.dispatch)
        .toContain({
          eventName: 'toaster-set',
          type: 'success',
          message: 'Tournament loaded',
        });
    });
  });
});
