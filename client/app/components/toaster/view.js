export let __hotReload = true;

import R from 'app/helpers/ramda';
import React from 'react';
import styles from 'app/helpers/styles';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { toasterSub } from 'app/components/toaster/sub';

export const Toaster = styles.decorator(React.createClass({
  displayName: 'Toaster',
  mixins: [ subscriptionsMixin, pureRenderMixin ],
  subscriptions: { toaster: toasterSub },
  getInitialState: toasterGetInitialState,
  render: toasterRender
}));

function toasterGetInitialState() {
  return { toaster: null };
}

function toasterRender() {
  const type = R.pathOr('info', ['toaster','type'], this.state);
  const message = R.pathOr('', ['toaster','message'], this.state);
  return (
    <div className={{
           show: this.state.toaster,
           [type]: true
         }}>
      {message}
    </div>
  );
}
