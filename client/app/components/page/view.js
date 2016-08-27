export let __hotReload = true;

import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import styles from 'app/helpers/styles';
import { ErrorToaster } from 'app/components/error/toasterView';

export const Page = styles.decorator(React.createClass({
  displayName: 'Page',
  mixins: [ pureRenderMixin ],
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
  mixins: [ pureRenderMixin ],
  render: pageContentRender
}));

function pageContentRender() {
  return (
    <div>
      <div className="insider">
        {this.props.children}
      </div>
      <ErrorToaster />
    </div>
  );
}
