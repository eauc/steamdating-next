export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Page, PageContent } from 'app/components/page/view';
/* eslint-enable no-unused-vars */

export const AboutPage = createComponent({
  render: aboutPageRender,
});

function aboutPageRender() {
  return (
    <Page>
      <PageContent>
        <p>About SteamDating</p>
      </PageContent>
    </Page>
  );
}
