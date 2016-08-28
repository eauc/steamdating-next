export let __hotReload = true;

import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import styles from 'app/helpers/styles';
import { Icon } from 'app/components/misc/misc';

export const NavToggle = styles.decorator(React.createClass({
  mixins: [ pureRenderMixin ],
  displayName: 'NavToggle',
  render: navToggleRender
}));

function navToggleRender() {
  return (
    <button onClick={this.props.onToggle}>
      <Icon name="bars" />
    </button>
  );
}
