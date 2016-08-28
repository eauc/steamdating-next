export let __hotReload = true;

import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import { Router, Route, IndexRedirect } from 'react-router';
import history from 'app/helpers/history';

import { HomePage }from 'app/pages/home/view';
import { PlayersListPage }from 'app/pages/players/listView';
import { PlayersCreatePage }from 'app/pages/players/createView';
import { PlayersEditPage }from 'app/pages/players/editView';
import { AboutPage } from 'app/pages/about/view';

export const Root = React.createClass({
  mixins: [ pureRenderMixin ],
  render: rootRender
});

function rootRender() {
  return (
    <Router history={history}>
      <Route path="/">
        <IndexRedirect to="home" />
        <Route path="home" components={HomePage} />
        <Route path="players">
          <IndexRedirect to="list" />
          <Route path="list" components={PlayersListPage} />
          <Route path="create" components={PlayersCreatePage} />
          <Route path="edit" components={PlayersEditPage} />
        </Route>
        <Route path="about" component={AboutPage} />
      </Route>
    </Router>
  );
}
