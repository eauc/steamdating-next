export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { React, createComponent } from 'app/helpers/react';
import { dispatch } from 'app/services/state';
import { FilterInput } from 'app/components/filter/filter';
import { sortSub } from 'app/components/sort/sort';
import { factionsSub } from 'app/components/factions/factions';
import { playersListSub } from 'app/components/players/sub';
import { Icon } from 'app/components/misc/misc';
import { PlayersListHeader } from 'app/components/players/listHeaderView';
import { PlayersListRow } from 'app/components/players/listRowView';

export const PlayersList = createComponent({
  displayName: 'PlayersList',
  subscriptions: {
    factions: factionsSub,
    players: playersListSub,
    sort: [sortSub, 'players', 'name']
  },
  render: playersListRender,
  getInitialState: playersListGetInitialState,
  onFilterUpdate: playersListOnFilterUpdate,
  dispatchFilterUpdate: playersListDispatchFilterUpdate
});

function playersListRender() {
  log.cycle('playersList render', this.state);
  const sort = R.propOr({}, 'sort', this.state);
  const headers = R.map((p) => {
    return (
      <PlayersListHeader
         key={p}
         name={p}
         sort={sort}
         />
    );
  }, this.state.players.columns);
  const rows = R.map((p) => {
    return (
      <PlayersListRow
         key={p.name}
         columns={this.state.players.columns}
         player={p}
         factions={this.state.factions}
         />
    );
  }, this.state.players.list);
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
  this.onFilterUpdate = R.bind(this.onFilterUpdate, this);
  this.dispatchFilterUpdate = R.debounce(500, R.bind(this.dispatchFilterUpdate, this));
  return { players: [] };
}

function playersListOnFilterUpdate(e) {
  this.setState({ filter: e.target.value });
  this.dispatchFilterUpdate(e.target.value);
}

function playersListDispatchFilterUpdate(value) {
  dispatch(['filter-set', 'players', value]);
}
