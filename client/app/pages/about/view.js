export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';
import { Page, PageContent } from 'app/components/page/view';

export const AboutPage = createComponent({
  render: aboutPageRender
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
