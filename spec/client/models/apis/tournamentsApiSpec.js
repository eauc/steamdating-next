import { beforeEach,
         it } from 'spec/client/helpers/helpers';

import tournamentsApiModel from 'app/models/apis/tournaments';

describe('tournamentsApiModel', function () {
  beforeEach(function () {
  });

  describe('getUrls({ onSuccess, onError })', function () {
    beforeEach(function () {
      this.params = {
        onSuccess: { eventName: 'success' },
        onError: { eventName: 'error' },
      };

      this.context = tournamentsApiModel.getUrls(this.params);
    });

    it('should create http request', function () {
      expect(this.context)
        .toEqual({
          method: 'GET',
          onError: { eventName: 'error' },
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
          .toEqual({
            eventName: 'success',
            urls: 'tournamentsUrls',
          });
      });
    });
  });

  describe('getMine({ authToken, onSuccess, onError, urls })', function () {
    beforeEach(function () {
      this.params = {
        authToken: 'token',
        onSuccess: { eventName: 'success' },
        onError: { eventName: 'error' },
        urls: { mine: '/mine' },
      };

      this.context = tournamentsApiModel.getMine(this.params);
    });

    it('should create http request', function () {
      expect(this.context)
        .toEqual({
          headers: { Authorization: 'Bearer token' },
          method: 'GET',
          onError: { eventName: 'error' },
          onSuccess: jasmine.any(Function),
          url: '/api/tournaments/mine',
        });
    });

    describe('success handler', function () {
      beforeEach(function () {
        this.successHandler = this.context.onSuccess;

        this.event = this.successHandler({
          tournaments: 'tournamentsList',
        });
      });

      it('should call "onSuccess" event with tournaments list', function () {
        expect(this.event)
          .toEqual({
            eventName: 'success',
            tournaments: 'tournamentsList',
          });
      });
    });
  });

  describe('load({ authToken, onSuccess, tournament })', function () {
    beforeEach(function () {
      this.params = {
        authToken: 'token',
        onSuccess: { eventName: 'success' },
        tournament: { link: '/link' },
      };
      this.context = tournamentsApiModel.load(this.params);
    });

    it('should load tournament from server', function () {
      expect(this.context)
        .toEqual({
          headers: { Authorization: 'Bearer token' },
          method: 'GET',
          onError: {
            eventName: 'toaster-set',
            type: 'error',
            message: 'Error loading tournament from server',
          },
          onSuccess: jasmine.any(Function),
          url: '/api/tournaments/link',
        });
    });

    describe('success handler', function () {
      beforeEach(function () {
        this.successHandler = this.context.onSuccess;

        this.event = this.successHandler({
          link: '/id',
          name: 'name',
          date: 'date',
          updatedAt: 'updated_at',
          tournament: {
            data: 'state',
          },
        });
      });

      it('should call "onSuccess" event with loaded tournament', function () {
        expect(this.event)
          .toEqual({
            eventName: 'success',
            tournament: {
              online: {
                link: '/id',
                date: 'date',
                name: 'name',
                updatedAt: 'updated_at',
              },
              data: 'state',
            },
          });
      });
    });
  });

  describe('save({ authToken, onSuccess, tournament, urls })', function () {
    beforeEach(function () {
      this.params = {
        authToken: 'token',
        onSuccess: { eventName: 'success' },
        tournament: {
          online: { name: 'name', date: 'date' },
          data: 'state',
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
              tournament: { data: 'state' },
              date: 'date',
              name: 'name',
            },
            headers: { Authorization: 'Bearer token' },
            method: 'POST',
            onError: {
              eventName: 'toaster-set',
              type: 'error',
              message: 'Error saving tournament on server',
            },
            onSuccess: jasmine.any(Function),
            url: '/api/tournaments/mine',
          });
      });
    });

    describe('when <tournament> has an online id', function () {
      beforeEach(function () {
        this.params.tournament.online.link = '/id';
        this.context = tournamentsApiModel.save(this.params);
      });

      it('should update tournament on server', function () {
        expect(this.context)
          .toEqual({
            data: {
              tournament: { data: 'state' },
              date: 'date',
              name: 'name',
            },
            headers: { Authorization: 'Bearer token' },
            method: 'PUT',
            onError: {
              eventName: 'toaster-set',
              type: 'error',
              message: 'Error saving tournament on server',
            },
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
          name: 'name',
          date: 'date',
          updatedAt: 'updated_at',
          tournament: {
            data: 'state',
          },
        });
      });

      it('should call "onSuccess" event with updated tournament', function () {
        expect(this.event)
          .toEqual({
            eventName: 'success',
            tournament: {
              online: {
                link: '/id',
                date: 'date',
                name: 'name',
                updatedAt: 'updated_at',
              },
              data: 'state',
            },
          });
      });
    });
  });
});
