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
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;

export const PlayersCreatePage = createComponent({
  render: playersCreatePageRender,
  doCreate: playersCreateDoCreate,
  doCancel: playersCreateDoCancel,
});

function playersCreatePageRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={this.doCancel}>
          <span>Cancel </span>
          <Icon name="close" />
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <PlayerEdit label="Create"
                    onSubmit={this.doCreate} />
      </PageContent>
    </Page>
  );
}

function playersCreateDoCreate() {
  dispatch({ eventName: 'players-createCurrentEdit' });
}

function playersCreateDoCancel() {
  dispatch({ eventName: 'navigate-back' });
}
