export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;
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
      columns,
    }))
);

export const playersEditOtherNamesSub = registerSubscription(
  'players-edit-other-names',
  (state) => {
    const baseName = state
            .map((state) => [R.path(['forms','player','base','name'], state)]);
    const playersNames = state
            .map(R.pathOr([], scope))
            .map(playersModel.names);
    return baseName
      .join(playersNames)
      .map(R.apply(R.without));
  }
);

export const playersEditCastersNamesSub = registerSubscription(
  'players-edit-casters-names',
  (state) => {
    const factionName = state
            .map(R.pathOr('', ['forms','player','edit','faction']));
    return factionName
      .join(factionsSub(state))
      .map(R.apply(factionsModel.castersFor));
  }
);
