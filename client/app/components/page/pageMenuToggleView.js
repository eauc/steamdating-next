export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const PageMenuToggle = createComponent({
  displayName: 'PageMenuToggle',
  render: pageMenuToggleRender,
});

function pageMenuToggleRender() {
  return (
    <button onClick={this.props.onToggle}>
      <Icon name={this.props.show ? 'chevron-down' : 'chevron-up'} />
    </button>
  );
}
