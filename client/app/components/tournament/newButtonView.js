export let __hotReload = true;

import { dispatch } from 'app/services/state';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const TournamentNewButton = createComponent({
  displayName: 'TournamentNewButton',
  render: newButtonRender,
  getInitialState: newButtonGetInitialState,
});

function newButtonRender() {
  return (
    <button type="button"
            onClick={() => dispatch(['tournament-set', {}])}>
      <Icon name="file-o" />
      <span> New</span>
    </button>
  );
}

function newButtonGetInitialState() {
  return {};
}
