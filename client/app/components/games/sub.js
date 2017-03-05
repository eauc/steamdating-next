export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;
import playersModel from 'app/models/players';
import { playersSub } from 'app/components/players/players';
// import factionsModel from 'app/models/factions';
// import { scope } from 'app/components/players/state';
// import { filterSub } from 'app/components/filter/filter';
// import { sortSub } from 'app/components/sort/sort';
// import { factionsSub } from 'app/components/factions/factions';

export const gamesEditSub = registerSubscription(
  'games-edit',
  (state) => {
    const players = playersSub([]);
    const player1Name = state
            .map(R.pathOr('', ['forms','game','edit','player1','name']));
    const player2Name = state
            .map(R.pathOr('', ['forms','game','edit','player2','name']));
    return players
      .join(player1Name.join(player2Name))
      .map(([players, [player1, player2]]) => ({
        player1: gameEditPlayerInfo({ name: player1 }, players),
        player2: gameEditPlayerInfo({ name: player2 }, players),
      }));
  }
);

function gameEditPlayerInfo({ name }, players) {
  return R.thread(players)(
    playersModel.player$({ name }),
    R.defaultTo({}),
    R.pick(['faction','lists'])
  );
}
