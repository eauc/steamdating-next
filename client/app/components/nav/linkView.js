export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */

export const NavLink = createComponent({
  displayName: 'NavItem',
  render: navLinkRender,
});

function navLinkRender() {
  const hash = `#${this.props.path}`;
  const isActive = this.props.currentHash.startsWith(hash);
  return (
    <a href={hash}
       onClick={this.props.onClick}
       className={{
         active: isActive,
       }}>
      {this.props.children}
    </a>
  );
}
