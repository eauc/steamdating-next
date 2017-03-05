export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { GameEdit } from 'app/components/games/games';
import { Icon } from 'app/components/misc/misc';
import { Page,
         PageContent,
         PageMenu,
         PageMenuItem,
       } from 'app/components/page/page';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;

export const GameEditPage = createComponent({
  render,
  doCancel,
  doUpdate,
});

function render() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={this.doCancel}>
          <Icon name="close" />
          <span> Cancel</span>
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <GameEdit
           onSubmit={this.doUpdate} />
      </PageContent>
    </Page>
  );
}

function doCancel() {
  dispatch({ eventName: 'navigate-back' });
}

function doUpdate() {
  dispatch({ eventName: 'rounds-updateCurrentGameEdit' });
}
