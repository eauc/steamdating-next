export let __hotReload = true;

import history from 'app/helpers/history';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { PageMenu, PageMenuItem } from 'app/components/pageMenu/view';
import { Page, PageContent } from 'app/components/page/view';
import { Icon } from 'app/components/misc/misc';
import { dispatch } from 'app/services/state';
import { PlayersList } from 'app/components/players/players';
/* eslint-enable no-unused-vars */

export const PlayersListPage = createComponent({
  render: playersListPageRender,
  onCreatePlayer: playersListPageOnCreatePlayer,
});

function playersListPageRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={this.onCreatePlayer}>
          <span>Create Player </span>
          <Icon name="user" />
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <PlayersList />
      </PageContent>
    </Page>
  );
}

function playersListPageOnCreatePlayer() {
  dispatch(['form-reset', 'player', {}])
    .then(() => {
      history.push('/players/create');
    });
}
