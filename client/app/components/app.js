export let __hotReload = true;

import React from 'react';

const App = React.createClass({
  render: appRender
});

export default App;

function appRender() {
  return (
    <div>Hello World</div>
  );
}
