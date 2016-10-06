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

export const PlayersEditPage = createComponent({
  render: playersEditPageRender,
  remove: playersEditRemove,
});

function playersEditPageRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={this.remove}>
          <span>Delete Player </span>
          <Icon name="trash" />
        </PageMenuItem>
        <PageMenuItem onClick={() => history.goBack()}>
          <span>Cancel </span>
          <Icon name="close" />
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <PlayerEdit label="Update"
                    onSubmit="players-update" />
      </PageContent>
    </Page>
  );
}

function playersEditRemove() {
  dispatch(['prompt-set', {
    type: 'confirm',
    msg: 'Are you sure you want to delete this player ?',
    onOk: ['players-remove-current-edit'],
  }]);
}
