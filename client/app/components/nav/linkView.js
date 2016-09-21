export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';

export const NavLink = createComponent({
  displayName: 'NavItem',
  render: navLinkRender
});

function navLinkRender() {
  const hash = `#${this.props.path}`;
  const is_active = this.props.current_hash.startsWith(hash);
  return (
    <a href={hash}
       onClick={this.props.onClick}
       className={{
         'active': is_active
       }}>
      {this.props.children}
    </a>
  );
}
