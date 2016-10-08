export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */

export const Page = createComponent({
  displayName: 'Page',
  render: pageRender,
});

function pageRender() {
  return (
    <div>
      {this.props.children}
    </div>
  );
}
