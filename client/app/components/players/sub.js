export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import { scope } from 'app/components/players/state';

export const playersListSub = registerSubscription(
  'players-list',
  (state) => state
    .map(R.pathOr([], scope))
);

export const playersEditOtherNamesSub = registerSubscription(
  'players-edit-other-names',
  (state) => {
    const base_name = state
            .map((s) => [R.path(['forms','player','base','name'], s)]);
    const players_names = state
            .map(R.pathOr([], scope))
            .map(R.pluck('name'));
    return base_name
      .join(players_names)
      .map(R.apply(R.without));
  }
);
