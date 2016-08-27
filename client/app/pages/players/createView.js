export let __hotReload = true;

import React from 'react';
import history from 'app/helpers/history';
import { PageMenu, PageMenuItem } from 'app/components/pageMenu/view';
import { Page, PageContent } from 'app/components/page/view';
import { Icon } from 'app/components/misc/misc';
import { PlayerEdit } from 'app/components/players/players';
import { dispatch } from 'app/services/state';

export const PlayersCreate = React.createClass({
  render: playersCreateRender
});

function playersCreateRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={() => history.goBack()}>
          <span>Cancel </span>
          <Icon name="close" />
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <PlayerEdit label="Create"
                    onSubmit="players-create" />
      </PageContent>
    </Page>
  );
}
