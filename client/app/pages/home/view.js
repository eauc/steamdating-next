export let __hotReload = true;

import R from 'ramda';
import log from 'app/helpers/log';

import React from 'react';
import { PageMenu, PageMenuItem } from 'app/components/pageMenu/view';
import { Page, PageContent } from 'app/components/page/view';
import { dispatch } from 'app/services/state';

export const Home = React.createClass({
  render: homeRender
});

function homeRender() {
  return (
    <Page>
      <PageMenu>
        <PageMenuItem onClick={() => {
            dispatch(['error-set', 'Ouuups1!']);
          }}>
          Home Menu 1
        </PageMenuItem>
        <PageMenuItem onClick={() => {
            dispatch(['error-set', 'Ouuups1!']);
            dispatch(['error-set', 'Ouuups2!']);
            dispatch(['error-set', 'Ouuups3!']);
            dispatch(['error-set', 'Ouuups4!']);
            dispatch(['error-set', 'Ouuups5!']);
          }}>
          Home Menu 2
        </PageMenuItem>
        <PageMenuItem>Home Menu 3</PageMenuItem>
      </PageMenu>
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
