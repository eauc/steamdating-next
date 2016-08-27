export let __hotReload = true;

import R from 'app/helpers/ramda';
import React from 'react';
import history from 'app/helpers/history';
import styles from 'app/helpers/styles';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { dispatch } from 'app/services/state';
import { playersListSub } from 'app/components/players/sub';

export const PlayersList = styles.decorator(React.createClass({
  displayName: 'PlayersList',
  mixins: [ subscriptionsMixin, pureRenderMixin ],
  subscriptions: {
    players: playersListSub
  },
  render: playersListRender,
  getInitialState: playersListGetInitialState
}));

function playersListRender() {
  const rows = R.map((p) => {
    return (
      <PlayerRow key={p.name}
                 player={p} />
    );
  }, this.state.players);
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Origin</th>
          <th>Faction</th>
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
    </table>
  );
}

function playersListGetInitialState() {
  return { players: [] };
}

export const PlayerRow = styles.decorator(React.createClass({
  displayName: 'PlayerRow',
  mixins: [ pureRenderMixin ],
  render: playerRowRender,
  getInitialState: playerRowGetInitialState,
  edit: playerRowEdit
}));

function playerRowRender() {
  const player = this.props.player;
  return (
    <tr onClick={this.edit}>
      <td>{player.name}</td>
      <td>{player.origin}</td>
      <td>{player.faction}</td>
    </tr>
  );
}

function playerRowGetInitialState() {
  this.edit = R.bind(this.edit, this);
  return {};
}

function playerRowEdit() {
  dispatch(['form-reset', 'player', this.props.player])
    .then(() => {
      history.push('/players/edit');
    });
}
