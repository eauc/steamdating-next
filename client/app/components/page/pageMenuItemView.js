export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */

export const PageMenuItem = createComponent({
  displayName: 'PageMenuItem',
  render: pageMenuItemRender,
});

function pageMenuItemRender() {
  return (
    <a href={this.props.href}
       onClick={this.props.onClick}>
      {this.props.children}
    </a>
  );
}
