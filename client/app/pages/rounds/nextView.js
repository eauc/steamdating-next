export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { RoundEdit } from 'app/components/rounds/rounds';
import { Page,
         PageContent,
         PageMenu,
         PageMenuItem,
       } from 'app/components/page/page';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;

export const RoundsNextPage = createComponent({
  render,
  doCreate,
});

function render() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={this.onSRSuggestion}>
          <span>Make SR suggestion </span>
        </PageMenuItem>
      </PageMenu>
      <PageContent>
        <RoundEdit label="Next Round"
                   onSubmit={this.doCreate} />
      </PageContent>
    </Page>
  );
}

function doCreate() {
  dispatch({ eventName: 'rounds-createCurrentEdit' });
}
