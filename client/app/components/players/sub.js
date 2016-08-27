export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';

const test_players = [{name:'jules'},{name:'edouard'}];

export const playersNamesSub = registerSubscription(
  'players-names',
  (state) => {
    return state
      .map(R.pathOr(test_players, ['tournament', 'players']))
      .map(R.pluck('name'));
  }
);
