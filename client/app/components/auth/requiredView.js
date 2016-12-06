export let __hotReload = true;

import stateService from 'app/services/state';
const { dispatch } = stateService;
import { authActiveSub } from 'app/components/auth/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
/* eslint-enable no-unused-vars */

export const AuthRequired = createComponent({
  displayName: 'AuthRequired',
  subscriptions: { active: authActiveSub },
  getInitialState: authGetInitialState,
  render: authRequiredRender,
});

function authGetInitialState() {
  return { active: false };
}

function authRequiredRender() {
  return this.state.active
    ? (
      <div>
        {this.props.children}
      </div>
    )
  : (
    <div>
      <div className="lock">
        <button
           className="signin"
           onClick={() => dispatch(['auth-signin'])}>
          <Icon name="sign-in" />
          <span> Sign In Required</span>
        </button>
      </div>
    </div>
  );
}
