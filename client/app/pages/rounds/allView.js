export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { RoundsSummary } from 'app/components/rounds/rounds';
import { RoundsPageMenu } from 'app/pages/rounds/menuView';
import { Page,
         PageContent,
       } from 'app/components/page/page';
/* eslint-enable no-unused-vars */

export const RoundsAllPage = createComponent({
  render,
});

function render() {
  return (
    <Page>
      <RoundsPageMenu />
      <PageContent>
        <RoundsSummary />
      </PageContent>
    </Page>
  );
}
