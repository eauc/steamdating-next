export let __hotReload = true;

import stateService from 'app/services/state';
const { dispatch } = stateService;
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
            onClick={() => dispatch({ eventName: 'tournament-set', tournament: {} })}>
      <Icon name="file-o" />
      <span> New</span>
    </button>
  );
}

function newButtonGetInitialState() {
  return {};
}
