export let __hotReload = true;

import history from 'app/helpers/history';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { PageMenu, PageMenuItem } from 'app/components/pageMenu/view';
import { Page, PageContent } from 'app/components/page/view';
import { Icon } from 'app/components/misc/misc';
import { PlayerEdit } from 'app/components/players/players';
import { dispatch } from 'app/services/state';
/* eslint-enable no-unused-vars */

export const PlayersCreatePage = createComponent({
  render: playersCreatePageRender,
});

function playersCreatePageRender() {
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
