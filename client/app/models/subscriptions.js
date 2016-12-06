export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import cellModel from 'app/models/cell.js';

const subscriptionsModel = {
  createContext: subscriptionsCreateContext,
  registerSubscription: subscriptionsRegisterSubscription,
  getSubscription: subscriptionsGetSubscription,
  revokeView: subscriptionsRevokeView,
  resolveCells: subscriptionsResolveCells,
  advanceTick: subscriptionsAdvanceTick,
};
export default R.curryService(subscriptionsModel);

function subscriptionsCreateContext() {
  return {
    TICK: 0,
    CELLS: [],
    SUBSCRIPTIONS: {},
  };
}

function subscriptionsRegisterSubscription(view, subscription, context) {
  if (R.prop(view, context.SUBSCRIPTIONS)) {
    log.state(`overwriting view "${view}" subscription`);
  }
  return R.assocPath(
    ['SUBSCRIPTIONS', view],
    subscription,
    context
  );
}

function subscriptionsGetSubscription(view, args, stateCell, context) {
  if (R.isNil(R.prop(view, context.SUBSCRIPTIONS))) {
    log.warn(`-- ignoring view "${view}" without subscription`);
    return cellModel.from(null);
  }
  const cell = context.SUBSCRIPTIONS[view](stateCell, [view, ...args]);
  cell._name = view;
  cell._args = JSON.stringify(R.map((arg) => {
    if ('Function' === R.type(arg)) return '##Fun';
    if ('Object' === R.type(arg)) return '{Obj}';
    return arg;
  }, args));
  return {
    cell,
    context: R.over(
      R.lensProp('CELLS'),
      R.append(cell),
      context
    ),
  };
}

function subscriptionsRevokeView(cell, context) {
  return R.over(
    R.lensProp('CELLS'),
    R.reject((_cell) => (_cell === cell)),
    context
  );
}

function subscriptionsResolveCells(context) {
  return cellModel
    .resolveCells(context.TICK + 1, context.CELLS);
}

function subscriptionsAdvanceTick(context) {
  return R.over(R.lensProp('TICK'), R.inc, context);
}
