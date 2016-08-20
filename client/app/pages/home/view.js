export let __hotReload = true;

import React from 'react';
import { Menu, MenuItem } from 'app/components/menu/view';
import { Page, PageContent } from 'app/components/page/view';

export const Home = React.createClass({
  render: homeRender
});

function homeRender() {
  return (
    <Page>
      <Menu>
        <MenuItem>Home Menu 1</MenuItem>
        <MenuItem>Home Menu 2</MenuItem>
        <MenuItem>Home Menu 3</MenuItem>
      </Menu>
      <PageContent>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
        <p>Welcome Home !</p>
      </PageContent>
    </Page>
  );
}
