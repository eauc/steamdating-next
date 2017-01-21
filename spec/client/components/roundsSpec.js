import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { roundsInitHandler,
         roundsStartCreateHandler,
         roundsCreateCurrentEditHandler,
       } from 'app/components/rounds/handler';

import gameModel from 'app/models/game';

describe('roundsComponent', function () {
  beforeEach(function () {
    this.state = {
      tournament: {
        players: [{}, {} , {}],
      },
    };
  });

  context('roundsInitHandler()', function () {
    return roundsInitHandler(this.state);
  }, function () {
    it('should reset round form', function () {
      expect(this.context)
        .toEqual({
          dispatch: {
            eventName: 'form-reset',
            formName: 'round',
            value: {
              games: [
                gameModel.create(),
                gameModel.create(),
              ],
            },
          },
        });
    });
  });

  context('roundsStartCreateHandler()', function () {
    return roundsStartCreateHandler(this.state);
  }, function () {
    beforeEach(function () {
      this.state.tournament.rounds = [
        { round: 1 },
      ];
      this.state.forms = {
        round: {
          edit: { round: 'next' },
        },
      };
    });

    it('should reset round form', function () {
      expect(this.context.dispatch)
        .toContain({
          eventName: 'form-reset',
          formName: 'round',
          value: {
            games: [
              gameModel.create(),
              gameModel.create(),
            ],
          },
        });
    });

    it('should navigate to next round\'s page', function () {
      expect(this.context.dispatch)
        .toContain({ eventName: 'navigate', to: '/rounds/next' });
    });
  });

  context('roundsCreateCurrentEditHandler()', function () {
    return roundsCreateCurrentEditHandler(this.state);
  }, function () {
    beforeEach(function () {
      this.state.tournament.rounds = [
        { round: 1 },
      ];
      this.state.forms = {
        round: {
          edit: { round: 'next' },
        },
      };
    });

    it('should create next round', function () {
      expect(this.context.state.tournament.rounds)
        .toEqual([
          ...this.state.tournament.rounds,
          { round: 'next' },
        ]);
    });

    it('should reset round form', function () {
      expect(this.context.dispatch)
        .toContain({
          eventName: 'form-reset',
          formName: 'round',
          value: {
            games: [
              gameModel.create(),
              gameModel.create(),
            ],
          },
        });
    });

    it('should navigate to new round\'s page', function () {
      expect(this.context.dispatch)
        .toContain({ eventName: 'navigate', to: '/rounds/1' });
    });
  });
});
