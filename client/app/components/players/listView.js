export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { sortSub } from 'app/components/sort/sort';
import { factionsSub } from 'app/components/factions/factions';
import { playersListSub } from 'app/components/players/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { FilterInput } from 'app/components/filter/filter';
import { Icon } from 'app/components/misc/misc';
import { PlayersListHeader } from 'app/components/players/listHeaderView';
import { PlayersListRow } from 'app/components/players/listRowView';
/* eslint-enable no-unused-vars */

export const PlayersList = createComponent({
  displayName: 'PlayersList',
  subscriptions: {
    factions: factionsSub,
    players: playersListSub,
    sort: [sortSub, 'players', 'name'],
  },
  render: playersListRender,
  getInitialState: playersListGetInitialState,
});

function playersListRender() {
  log.cycle('playersList render', this.state);
  const sort = R.propOr({}, 'sort', this.state);
  const headers = R.map((prop) => (
    <PlayersListHeader
       key={prop}
       name={prop}
       sort={sort}
       />
  ), this.state.players.columns);
  const rows = R.map((player) => (
    <PlayersListRow
       key={player.name}
       columns={this.state.players.columns}
       player={player}
       factions={this.state.factions}
       />
  ), this.state.players.list);
  return (
    <div>
      <FilterInput name="players" />
      <table className="list">
        <thead>
          <tr>
            {headers}
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
}

function playersListGetInitialState() {
  return { players: [] };
}
