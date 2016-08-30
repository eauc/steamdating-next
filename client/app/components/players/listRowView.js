export let __hotReload = true;

import R from 'app/helpers/ramda';
import React from 'react';
import history from 'app/helpers/history';
import styles from 'app/helpers/styles';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import { dispatch } from 'app/services/state';

export const PlayersListRow = styles.decorator(React.createClass({
  displayName: 'PlayersListRow',
  mixins: [ pureRenderMixin ],
  render: playersListRowRender,
  getInitialState: playersListRowGetInitialState,
  edit: playersListRowEdit
}));

function playersListRowRender() {
  const player = this.props.player;
  const cells = R.map((p) => {
    return (<td key={p}>{player[p]}</td>);
  }, this.props.columns);
  return (
    <tr onClick={this.edit}>
      {cells}
    </tr>
  );
}

function playersListRowGetInitialState() {
  this.edit = R.bind(this.edit, this);
  return {};
}

function playersListRowEdit() {
  dispatch(['form-reset', 'player', this.props.player])
    .then(() => {
      history.push('/players/edit');
    });
}
