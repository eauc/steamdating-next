export let __hotReload = true;

import subscriptionsMixin from 'app/mixins/subscriptions';
import _sub_ from 'app/components/errorToaster/sub';
import _handler_ from 'app/components/errorToaster/handler';

import React from 'react';
import styles from 'app/helpers/styles';

export const ErrorToaster = styles.decorator(React.createClass({
  displayName: 'ErrorToaster',
  mixins: [ subscriptionsMixin ],
  subscriptions: { error: ['error'] },
  getInitialState: errorToasterGetInitialState,
  render: errorToasterRender
}));

function errorToasterGetInitialState() {
  return { error: null };
}

function errorToasterRender() {
  return (
    <div className={{
           show: this.state.error
         }}>
      Error  : {this.state.error}
    </div>
  );
}
