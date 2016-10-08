export let __hotReload = true;

import history from 'app/helpers/history';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Page,
         PageContent,
         PageMenu,
         PageMenuItem,
       } from 'app/components/page/page';
import { Icon } from 'app/components/misc/misc';
import { PlayerEdit } from 'app/components/players/players';
import { dispatch } from 'app/services/state';
/* eslint-enable no-unused-vars */

export const PlayersEditPage = createComponent({
  render: playersEditPageRender,
  remove: playersEditRemove,
  doUpdate: playersEditDoUpdate,
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
                    onSubmit={this.doUpdate} />
      </PageContent>
    </Page>
  );
}

function playersEditRemove() {
  dispatch(['prompt-set', {
    type: 'confirm',
    msg: 'Are you sure you want to delete this player ?',
    onOk: ['players-removeCurrentEdit'],
  }]);
}

function playersEditDoUpdate(form) {
  dispatch(['players-update', form])
    .then(() => history.goBack());
}
