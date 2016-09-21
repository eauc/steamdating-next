export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';
import { dispatch } from 'app/services/state';
import { Icon } from 'app/components/misc/misc';

export const TournamentNewButton = createComponent({
  displayName: 'TournamentNewButton',
  render: newButtonRender,
  getInitialState: newButtonGetInitialState
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
