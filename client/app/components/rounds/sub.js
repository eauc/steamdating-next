export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;
import roundModel from 'app/models/round';
import { scope as formsScope } from 'app/components/form/state';
import { scope as playersScope } from 'app/components/players/state';

export const roundsEditSub = registerSubscription(
  'rounds-edit',
  (state) => {
    const players = state
            .map(R.pathOr([], playersScope));
    return state
      .map(R.pathOr({}, [...formsScope,'round','edit']))
      .join(players)
      .map(([round, players]) => {
        const validation = roundModel.validate({ players }, round);
        return {
          round,
          players,
          ...validation,
        };
      });
  }
);
