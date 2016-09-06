export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerSubscription } from 'app/services/state';
import playersModel from 'app/models/players';
import factionsModel from 'app/models/factions';
import { scope } from 'app/components/players/state';
import { filterSub } from 'app/components/filter/filter';
import { sortSub } from 'app/components/sort/sort';
import { factionsSub } from 'app/components/factions/factions';

export const playersListSub = registerSubscription(
  'players-list',
  (state) => state
    .map(R.pathOr([], scope))
    .join(filterSub(['players']))
    .map(([players, filter]) => playersModel.filter(filter, players))
    .join(sortSub(['players', 'name']))
    .map(([{ list, columns }, sort]) => ({
      list: playersModel.sort(sort, list),
      columns
    }))
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

export const playersEditCastersNamesSub = registerSubscription(
  'players-edit-casters-names',
  (state) => {
    const faction_name = state
            .map(R.pathOr('', ['forms','player','edit','faction']));
    return faction_name
      .join(factionsSub(state))
      .map(R.apply(factionsModel.castersFor));
  }
);
