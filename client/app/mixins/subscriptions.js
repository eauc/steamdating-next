export let __hotReload = true;

import R from 'ramda';
import log from 'app/helpers/log';
import { getSubscription, revokeSubscription } from 'app/services/state';

const subscriptionsMixin = {
  componentWillMount: subscriptionsWillMount,
  componentWillUnmount: subscriptionsWillUnmount,
  getSubscriptions: subscriptionsGet
};

export default subscriptionsMixin;

function subscriptionsWillMount() {
  log.cycle('subscriptionsMixin','willMount', this, this.subscriptions);
  this.getSubscriptions();
}

function subscriptionsWillUnmount() {
  log.cycle('subscriptionsMixin','willUnmount', this, this.views);
  R.forEach((view) => {
    revokeSubscription(this.views[view]);
  }, R.keys(this.views));
}

function subscriptionsGet() {
  this.views = R.reduce((mem, view) => {
    let sub = this.subscriptions[view];
    if(R.type(sub) === 'String') sub = [sub];
    if(R.type(sub) === 'Function') sub = sub.apply(this);

    return R.assoc(
      view,
      getSubscription(sub)
        .changes((value) => {
          this.setState({ [view]: value });
        }),
      mem
    );
  }, {}, R.keys(this.subscriptions));
}
