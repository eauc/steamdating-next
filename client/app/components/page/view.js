export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';
import { Toaster } from 'app/components/toaster/toaster';

export const Page = createComponent({
  displayName: 'Page',
  render: pageRender
});

function pageRender() {
  return (
    <div>
      {this.props.children}
    </div>
  );
}

export const PageContent = createComponent({
  displayName: 'PageContent',
  render: pageContentRender
});

function pageContentRender() {
  return (
    <div>
      <div className="insider">
        {this.props.children}
      </div>
      <Toaster />
    </div>
  );
}
