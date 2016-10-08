export let __hotReload = true;

import log from 'app/helpers/log';
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
  log.cycle('navLink', this.props, hash, isActive);
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
