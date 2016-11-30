import { beforeEach,
         it } from 'spec/client/helpers/helpers';

import tournamentsApiModel from 'app/models/apis/tournaments';

describe('tournamentsApiModel', function () {
  beforeEach(function () {
  });

  describe('getUrls({ onSuccess, onError })', function () {
    beforeEach(function () {
      this.params = {
        onSuccess: ['success'],
        onError: ['error'],
      };

      this.context = tournamentsApiModel.getUrls(this.params);
    });

    it('should create http request', function () {
      expect(this.context)
        .toEqual({
          method: 'GET',
          onError: ['error'],
          onSuccess: jasmine.any(Function),
          url: '/api/tournaments',
        });
    });

    describe('success handler', function () {
      beforeEach(function () {
        this.successHandler = this.context.onSuccess;

        this.event = this.successHandler({
          tournaments: 'tournamentsUrls',
        });
      });

      it('should call "onSuccess" event with tournaments urls', function () {
        expect(this.event)
          .toEqual(['success', 'tournamentsUrls']);
      });
    });
  });

  describe('getMine({ authToken, onSuccess, onError, urls })', function () {
    beforeEach(function () {
      this.params = {
        authToken: 'token',
        onSuccess: ['success'],
        onError: ['error'],
        urls: { mine: '/mine' },
      };

      this.context = tournamentsApiModel.getMine(this.params);
    });

    it('should create http request', function () {
      expect(this.context)
        .toEqual({
          headers: { Authorization: 'Bearer token' },
          method: 'GET',
          onError: ['error'],
          onSuccess: jasmine.any(Function),
          url: '/api/tournaments/mine',
        });
    });

    describe('success handler', function () {
      beforeEach(function () {
        this.successHandler = this.context.onSuccess;

        this.event = this.successHandler({
          data: 'tournamentsList',
        });
      });

      it('should call "onSuccess" event with tournaments list', function () {
        expect(this.event)
          .toEqual(['success', 'tournamentsList']);
      });
    });
  });

  describe('load({ authToken, onSuccess, tournament })', function () {
    beforeEach(function () {
      this.params = {
        authToken: 'token',
        onSuccess: ['success'],
        tournament: { link: '/link' },
      };
      this.context = tournamentsApiModel.load(this.params);
    });

    it('should load tournament from server', function () {
      expect(this.context)
        .toEqual({
          headers: { Authorization: 'Bearer token' },
          method: 'GET',
          onError: ['toaster-set', {
            type: 'error',
            message: 'Error loading tournament from server',
          }],
          onSuccess: jasmine.any(Function),
          url: '/api/tournaments/link',
        });
    });

    describe('success handler', function () {
      beforeEach(function () {
        this.successHandler = this.context.onSuccess;

        this.event = this.successHandler({
          link: '/id',
          data: {
            name: 'name',
            date: 'date',
            id: 'id',
            updated_at: 'updated_at',
            data: '{"tournament":"state"}',
          },
        });
      });

      it('should call "onSuccess" event with loaded tournament', function () {
        expect(this.event)
          .toEqual(['success', {
            online: {
              date: 'date',
              id: '/id',
              name: 'name',
              updated_at: 'updated_at',
            },
            tournament: 'state',
          }]);
      });
    });
  });

  describe('save({ authToken, onSuccess, tournament, urls })', function () {
    beforeEach(function () {
      this.params = {
        authToken: 'token',
        onSuccess: ['success'],
        tournament: {
          online: { name: 'name', date: 'date' },
          tournament: 'state',
        },
        urls: { mine: '/mine' },
      };
    });

    describe('when <tournament> doesn\'t have an online id', function () {
      it('should create tournament on server', function () {
        this.context = tournamentsApiModel.save(this.params);

        expect(this.context)
          .toEqual({
            data: {
              data: '{"online":{"name":"name","date":"date"},"tournament":"state"}',
              date: 'date',
              name: 'name',
            },
            headers: { Authorization: 'Bearer token' },
            method: 'POST',
            onError: ['toaster-set', { message: 'Error saving tournament on server', type: 'error' }],
            onSuccess: jasmine.any(Function),
            url: '/api/tournaments/mine',
          });
      });
    });

    describe('when <tournament> has an online id', function () {
      beforeEach(function () {
        this.params.tournament.online.id = '/id';
        this.context = tournamentsApiModel.save(this.params);
      });

      it('should update tournament on server', function () {
        expect(this.context)
          .toEqual({
            data: {
              data: '{"online":{"name":"name","date":"date","id":"/id"},"tournament":"state"}',
              date: 'date',
              name: 'name',
            },
            headers: { Authorization: 'Bearer token' },
            method: 'PUT',
            onError: ['toaster-set', { message: 'Error saving tournament on server', type: 'error' }],
            onSuccess: jasmine.any(Function),
            url: '/api/tournaments/id',
          });
      });
    });

    describe('success handler', function () {
      beforeEach(function () {
        this.context = tournamentsApiModel.save(this.params);
        this.successHandler = this.context.onSuccess;

        this.event = this.successHandler({
          link: '/id',
          data: {
            name: 'name',
            date: 'date',
            id: 'id',
            updated_at: 'updated_at',
            data: '{"tournament":"state"}',
          },
        });
      });

      it('should call "onSuccess" event with updated tournament', function () {
        expect(this.event)
          .toEqual(['success', {
            online: {
              date: 'date',
              id: '/id',
              name: 'name',
              updated_at: 'updated_at',
            },
            tournament: 'state',
          }]);
      });
    });
  });
});
