export let __hotReload = true;

import R from './ramda';
import _React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/helpers/mixins/subscriptions';
import styles from 'app/helpers/styles';

export const React = _React;
export function createComponent(desc) {
  let mixins = R.defaultTo([], desc.mixins);
  mixins = R.append(pureRenderMixin, mixins);
  if(desc.subscriptions) {
    mixins = R.append(subscriptionsMixin, mixins);
  }
  desc.mixins = mixins;
  let component = _React.createClass(desc);
  if(desc.displayName) {
    component = styles.decorator(component);
  }
  return component;
}

if(self.STEAMDATING_CONFIG.debug) {
  System.import('react-addons-perf')
    .then((ReactPerf) => {
      self.ReactPerf = ReactPerf;
    });

  System.import('why-did-you-update')
    .then(({whyDidYouUpdate}) => {
      whyDidYouUpdate(_React);
    });
}
