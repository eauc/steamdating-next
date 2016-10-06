export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const NavToggle = createComponent({
  displayName: 'NavToggle',
  render: navToggleRender,
});

function navToggleRender() {
  return (
    <button onClick={this.props.onToggle}>
      <Icon name="bars" />
    </button>
  );
}
