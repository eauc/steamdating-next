export let __hotReload = true;

import { dispatch } from 'app/services/state';
import { authActiveSub } from 'app/components/auth/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */

export const AuthToggleButton = createComponent({
  displayName: 'AuthToggleButton',
  subscriptions: { active: authActiveSub },
  render: authToggleButtonRender,
  getInitialState: authToggleButtonGetInitialState,
  doToggle: authToggleButtonDoToggle,
});

function authToggleButtonRender() {
  return (
    <button className={{
              active: this.state.active,
            }}
            onClick={this.doToggle}>
      {this.props.children}
    </button>
  );
}

function authToggleButtonGetInitialState() {
  return {};
}

function authToggleButtonDoToggle() {
  if (this.state.active) {
    dispatch(['auth-signout']);
  }
  else {
    dispatch(['auth-signin']);
  }
}
