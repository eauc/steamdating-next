export let __hotReload = true;

import R from 'app/helpers/ramda';
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
  toggle: authToggleButtonToggle,
});

function authToggleButtonRender() {
  return (
    <button className={{
              active: this.state.active,
            }}
            onClick={this.toggle}>
      {this.props.children}
    </button>
  );
}

function authToggleButtonGetInitialState() {
  this.toggle = R.bind(this.toggle, this);
  return {};
}

function authToggleButtonToggle() {
  if (this.state.active) {
    dispatch(['auth-signout']);
  }
  else {
    dispatch(['auth-signin']);
  }
}
