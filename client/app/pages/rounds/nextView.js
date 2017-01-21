export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { RoundEdit } from 'app/components/rounds/rounds';
import { RoundsPageMenu } from 'app/pages/rounds/menuView';
import { Page,
         PageContent,
         PageMenuItem,
       } from 'app/components/page/page';
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
      <RoundsPageMenu>
        <PageMenuItem onClick={this.doSRSuggestion}>
          <span>Make SR suggestion </span>
        </PageMenuItem>
      </RoundsPageMenu>
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
