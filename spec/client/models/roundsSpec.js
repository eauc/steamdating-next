import { example } from 'spec/client/helpers/helpers';

import roundsModel from 'app/models/rounds';

describe('roundsModel', function () {
  describe('add(<newRound>)', function () {
    example(function ({ rounds, newRound, result }, desc) {
      it(`should add <newRound> to rounds, ${desc}`, function () {
        expect(roundsModel.add(newRound, rounds))
          .toEqual(result);
      });
    }, [
      ['rounds', 'newRound', 'result'],
      [[], { round: 1 }, [{ round: 1 }]],
      [[{ round: 1 },
        { round: 2 }],
       { round: 'next' },
       [{ round: 1 },
        { round: 2 },
        { round: 'next' }]],
    ]);
  });
});
