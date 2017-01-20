import { beforeEach,
         context,
         it } from 'spec/client/helpers/helpers';

import { roundsInitHandler,
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
        .toEqual([
          {
            eventName: 'form-reset',
            formName: 'round',
            value: {
              games: [
                gameModel.create(),
                gameModel.create(),
              ],
            },
          },
          { eventName: 'navigate', to: '/rounds/1' },
        ]);
    });
  });
});
