export let __hotReload = true;

import React from 'react';
import { Page, PageContent } from 'app/components/page/view';

export const About = React.createClass({
  render: aboutRender
});

function aboutRender() {
  return (
    <Page>
      <PageContent>
        <p>About SteamDating</p>
      </PageContent>
    </Page>
  );
}
