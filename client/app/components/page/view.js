export let __hotReload = true;

import React from 'react';
import styles from 'app/helpers/styles';

export const Page = styles.decorator(React.createClass({
  displayName: 'Page',
  render: pageRender
}));

function pageRender() {
  return (
    <div>
      {this.props.children}
    </div>
  );
}

export const PageContent = styles.decorator(React.createClass({
  displayName: 'PageContent',
  render: pageContentRender
}));

function pageContentRender() {
  return (
    <div>
      <div className="insider">
        {this.props.children}
      </div>
    </div>
  );
}
