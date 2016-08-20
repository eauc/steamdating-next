export let __hotReload = true;

import React from 'react';
import { Router, Route, IndexRedirect, hashHistory } from 'react-router';

import { Home }from 'app/pages/home/view';
import { About } from 'app/pages/about/view';

export const Root = React.createClass({
  render: rootRender
});

function rootRender() {
  return (
    <Router history={hashHistory}>
      <Route path="/">
        <IndexRedirect to="home" />
        <Route path="/home" components={Home} />
        <Route path="/about" component={About} />
      </Route>
    </Router>
  );
}
