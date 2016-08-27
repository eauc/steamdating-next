export let __hotReload = true;

import React from 'react';
import history from 'app/helpers/history';
import { PageMenu, PageMenuItem } from 'app/components/pageMenu/view';
import { Page, PageContent } from 'app/components/page/view';
import { Icon } from 'app/components/misc/view';
import { PlayerEdit } from 'app/components/players/players';
import { dispatch } from 'app/services/state';

export const PlayersCreate = React.createClass({
  render: playersCreateRender
});

function playersCreateRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem>
          <span>Save </span>
          <Icon name="save" />
        </PageMenuItem>
        <PageMenuItem onClick={() => history.goBack()}>
          <span>Cancel </span>
          <Icon name="close" />
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['error-set', 'Ouuups1!']);
          }}>
          Home Menu 1
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <PlayerEdit label="Create"
                    onSubmit="players-create" />
      </PageContent>
    </Page>
  );
}
