export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/factions/state';

export const factionsSub = registerSubscription('factions', (state) => {
  return state
    .map(R.pathOr({}, scope));
});

export const factionsNamesSub = registerSubscription('factions-names', (state) => {
  return state
    .map(R.pathOr({}, scope))
    .map(R.keys);
});
