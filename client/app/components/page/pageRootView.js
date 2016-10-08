export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Router, Route, IndexRedirect } from 'react-router';
/* eslint-enable no-unused-vars */
import history from 'app/helpers/history';

import { HomePage } from 'app/pages/home/view';
import { PlayersListPage } from 'app/pages/players/listView';
import { PlayersCreatePage } from 'app/pages/players/createView';
import { PlayersEditPage } from 'app/pages/players/editView';
import { FilePage } from 'app/pages/file/view';
import { AboutPage } from 'app/pages/about/view';

export const PageRoot = createComponent({
  render: rootRender,
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
        <Route path="file" component={FilePage} />
        <Route path="about" component={AboutPage} />
      </Route>
    </Router>
  );
}
