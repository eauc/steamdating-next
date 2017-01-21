export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;
import { scope } from 'app/components/rounds/state';
import { filterRegExpSub } from 'app/components/filter/filter';
import { formSub } from 'app/components/form/form';
import { playersSub } from 'app/components/players/players';
import { sortSub } from 'app/components/sort/sort';
import playersModel from 'app/models/players';
import roundModel from 'app/models/round';
import roundsModel from 'app/models/rounds';

export const roundsSub = registerSubscription(
  'rounds',
  (state) => state
    .map(R.pathOr([], scope))
);

export const roundsNthSub = registerSubscription(
  'rounds-nth',
  (state, [_name_, index]) => state
    .map(R.pathOr([], scope))
    .map(R.compose(R.defaultTo({}), R.nth(index)))
    .map(R.over(
      R.lensPropOr([],'games'),
      R.mapIndexed((game, index) => R.assoc('index', index, game))
    ))
    .join(filterRegExpSub(['roundsNth']))
    .map(([round, filterRegExp]) => roundModel.filter({ filterRegExp }, round))
    .join(sortSub(['round','table']))
    .map(([round, sort]) => roundModel.sort(sort, round))
);

export const roundsEditSub = registerSubscription(
  'rounds-edit',
  () => formSub(['round'])
    .map(R.propOr({}, 'edit'))
    .join(playersSub([]))
    .map(([round, players]) => {
      const validation = roundModel.validate({ players }, round);
      return {
        round,
        players,
        ...validation,
      };
    })
);
