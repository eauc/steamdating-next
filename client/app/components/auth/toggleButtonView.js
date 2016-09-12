export let __hotReload = true;

import R from 'app/helpers/ramda';
import React from 'react';
import styles from 'app/helpers/styles';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { dispatch} from 'app/services/state';
import { authActiveSub } from 'app/components/auth/sub';

export const AuthToggleButton = styles.decorator(React.createClass({
  displayName: 'AuthToggleButton',
  mixins: [ subscriptionsMixin ],
  subscriptions: { active: authActiveSub },
  render: authToggleButtonRender,
  getInitialState: authToggleButtonGetInitialState,
  toggle: authToggleButtonToggle
}));

function authToggleButtonRender() {
  return (
    <button className={{
              active: this.state.active
            }}onClick={this.toggle}>
      {this.props.children}
    </button>
  );
}

function authToggleButtonGetInitialState() {
  this.toggle = R.bind(this.toggle, this);
  return {};
}

function authToggleButtonToggle() {
  if(this.state.active) {
    dispatch(['auth-signout']);
  }
  else {
    dispatch(['auth-signin']);
  }
}
