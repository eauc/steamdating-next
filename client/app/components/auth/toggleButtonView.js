export let __hotReload = true;

import stateService from 'app/services/state';
const { dispatch } = stateService;
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
    dispatch({ eventName: 'auth-signout' });
  }
  else {
    dispatch({ eventName: 'auth-signin' });
  }
}
