export let __hotReload = true;

import React from 'react';

export const Page = React.createClass({
  render: pageRender
});

function pageRender() {
  return (
    <div className="sd-content-wrap">
      {this.props.children}
    </div>
  );
}

export const PageContent = React.createClass({
  render: pageContentRender
});

function pageContentRender() {
  return (
    <div className="sd-page">
      <div className="sd-page-wrap">
        {this.props.children}
      </div>
    </div>
  );
}
