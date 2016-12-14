export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Page,
         PageContent,
         PageMenu,
         PageMenuItem,
       } from 'app/components/page/page';
import { Icon } from 'app/components/misc/misc';
import { PlayerEdit } from 'app/components/players/players';
import stateService from 'app/services/state';
const { dispatch } = stateService;
/* eslint-enable no-unused-vars */

export const PlayersEditPage = createComponent({
  render: playersEditPageRender,
  remove: playersEditRemove,
  doUpdate: playersEditDoUpdate,
  doCancel: playersEditDoCancel,
});

function playersEditPageRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={this.remove}>
          <span>Delete Player </span>
          <Icon name="trash" />
        </PageMenuItem>
        <PageMenuItem onClick={this.doCancel}>
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
  dispatch({
    eventName: 'prompt-set',
    type: 'confirm',
    msg: 'Are you sure you want to delete this player ?',
    onOk: { eventName: 'players-removeCurrentEdit' },
  });
}

function playersEditDoUpdate() {
  dispatch({ eventName: 'players-updateCurrentEdit' });
}

function playersEditDoCancel() {
  dispatch({ eventName: 'players-closeEdit' });
}
