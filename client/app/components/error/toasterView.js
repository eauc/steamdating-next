export let __hotReload = true;

import React from 'react';
import styles from 'app/helpers/styles';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';

export const ErrorToaster = styles.decorator(React.createClass({
  displayName: 'ErrorToaster',
  mixins: [ subscriptionsMixin, pureRenderMixin ],
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
