export let __hotReload = true;

import React from 'react';
import history from 'app/helpers/history';
import { PageMenu, PageMenuItem } from 'app/components/pageMenu/view';
import { Page, PageContent } from 'app/components/page/view';
import { Icon } from 'app/components/misc/misc';
import { dispatch } from 'app/services/state';

export const PlayersList = React.createClass({
  render: playersListRender,
  onCreatePlayer: playersListOnCreatePlayer
});

function playersListRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={this.onCreatePlayer}>
          <span>Create Player </span>
          <Icon name="user" />
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <h4>Players List</h4>
      </PageContent>
    </Page>
  );
}

function playersListOnCreatePlayer() {
  dispatch(['form-reset', 'player', {}])
    .then(() => {
      history.push('/players/create');
    });
}
