export let __hotReload = true;

import React from 'react';
import styles from 'app/helpers/styles';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { dispatch} from 'app/services/state';
import { authActiveSub } from 'app/components/auth/sub';
import { Icon } from 'app/components/misc/misc';

export const AuthRequired = styles.decorator(React.createClass({
  displayName: 'AuthRequired',
  mixins: [ subscriptionsMixin ],
  subscriptions: { active: authActiveSub },
  render: authRequiredRender
}));

function authRequiredRender() {
  return this.state.active
    ? (
      <div>
        {this.props.children}
      </div>
    )
  : (
    <div>
      <button
         className="signin"
         onClick={() => dispatch(['auth-signin'])}>
        <Icon name="sign-in" />
        <span> Sign In Required</span>
      </button>
    </div>
  );
}