export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;
import { scope } from 'app/components/factions/state';

export const factionsSub = registerSubscription(
  'factions',
  (state) => state
    .map(R.pathOr({}, scope))
);

export const factionsNamesSub = registerSubscription(
  'factions-names',
  (state) => state
    .map(R.pathOr({}, scope))
    .map(R.keys)
);
