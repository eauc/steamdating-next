export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';

export const NavToggle = createComponent({
  displayName: 'NavToggle',
  render: navToggleRender
});

function navToggleRender() {
  return (
    <button onClick={this.props.onToggle}>
      <Icon name="bars" />
    </button>
  );
}
