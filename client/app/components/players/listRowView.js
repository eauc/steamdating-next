export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { dispatch } = stateService;
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { FactionIcon } from 'app/components/factions/factions';
/* eslint-enable no-unused-vars */

export const PlayersListRow = createComponent({
  displayName: 'PlayersListRow',
  render: playersListRowRender,
  getInitialState: playersListRowGetInitialState,
  doEdit: playersListRowDoEdit,
});

function playersListRowRender() {
  const player = this.props.player;
  const cells = R.map((prop) => {
    let icon;
    if (prop === 'faction') {
      icon = (
        <FactionIcon
           faction={player[prop]}
           factions={this.props.factions} />
      );
    }
    const value = (
      'Array' === R.type(player[prop])
        ? player[prop].join(', ')
        : player[prop]
    );
    return (
      <td key={prop}
          className={prop}>
        {icon}
        <span>{value}</span>
      </td>
    );
  }, this.props.columns);
  return (
    <tr onClick={this.doEdit}>
      {cells}
    </tr>
  );
}

function playersListRowGetInitialState() {
  return {};
}

function playersListRowDoEdit() {
  dispatch(['players-startEdit', this.props.player]);
}
