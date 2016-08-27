export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { revokeView } from 'app/services/state';

const subscriptionsMixin = {
  componentWillMount: subscriptionsWillMount,
  componentWillUnmount: subscriptionsWillUnmount,
  getSubscriptions: subscriptionsGet
};

export default subscriptionsMixin;

function subscriptionsWillMount() {
  log.cycle('subscriptionsMixin','willMount', this, this.subscriptions);
  this.getSubscriptions();
  const samples = R.map(
    ([name, view]) => [name, view.value()],
    R.toPairs(this.views)
  );
  this.setState(R.fromPairs(samples));
}

function subscriptionsWillUnmount() {
  log.cycle('subscriptionsMixin','willUnmount', this, this.views);
  R.forEach((view) => {
    revokeView(this.views[view]);
  }, R.keys(this.views));
}

function subscriptionsGet() {
  this.views = R.reduce((mem, view) => {
    let sub = this.subscriptions[view];
    if(R.type(sub) === 'Function') sub = [sub];

    const [ getView, ...args] = sub;
    return R.assoc(
      view,
      getView.apply(this, [args]).changes((value) => {
        this.setState({ [view]: value });
      }),
      mem
    );
  }, {}, R.keys(this.subscriptions));
}
