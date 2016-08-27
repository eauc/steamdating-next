export let __hotReload = true;

import React from 'react';
import { Page, PageContent } from 'app/components/page/view';

export const AboutPage = React.createClass({
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
