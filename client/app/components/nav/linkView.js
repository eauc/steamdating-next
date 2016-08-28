export let __hotReload = true;

import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import styles from 'app/helpers/styles';

export const NavLink = styles.decorator(React.createClass({
  mixins: [ pureRenderMixin ],
  displayName: 'NavItem',
  render: navLinkRender
}));

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
