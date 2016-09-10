export let __hotReload = true;

import React from 'react';
import styles from 'app/helpers/styles';
import { dispatch } from 'app/services/state';
import { Icon } from 'app/components/misc/misc';

export const TournamentNewButton = styles.decorator(React.createClass({
  displayName: 'TournamentNewButton',
  render: newButtonRender,
  getInitialState: newButtonGetInitialState
}));

function newButtonRender() {
  return (
    <button type="button"
            onClick={() => dispatch(['prompt-set',
                                     { type: 'confirm',
                                       msg: 'You sure ?',
                                       onOk: ['tournament-set', {}] }])}>
      <Icon name="file-o" />
      <span> New</span>
    </button>
  );
}

function newButtonGetInitialState() {
  return {};
}
