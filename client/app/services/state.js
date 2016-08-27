export let __hotReload = true;

import R from 'ramda';
import log from 'app/helpers/log';
import tasksQueueModel from 'app/models/tasksQueue.js';
import cellModel from 'app/models/cell.js';

let TICK = 0;
let STATE = {};
const STATE_CELL = cellModel.from(() => STATE);
STATE_CELL._name = 'STATE';
let CELLS = [];
const HANDLERS = {};
const SUBSCRIPTIONS = {};
const EVENT_QUEUE = tasksQueueModel.create();

export function registerHandler(event, ...args) {
  if(R.prop(event, HANDLERS)) {
    log.state(`overwriting event "${event}" handler`);
  }
  if(args.length === 1) {
    const [handler] = args;
    HANDLERS[event] = handler;
  }
  else {
    const [middlewares, handler] = args;
    HANDLERS[event] = R.apply(R.compose, R.flatten(middlewares))(handler);
  }
}

export function registerSubscription(view, subscription) {
  if(R.prop(view, SUBSCRIPTIONS)) {
    log.state(`overwriting view "${view}" subscription`);
  }
  SUBSCRIPTIONS[view] = subscription;
  return getSubscription(view);
}

export function getPermanentSubscription(name, [sub, ...args]) {
  self._views = self._views || {};
  if(self._views[name]) {
    log.sub('permanentSub revoke', name);
    revokeView(self._views[name]);
  }
  log.sub('permanentSub get', name, sub, args);
  self._views[name] = sub(args);
}

const getSubscription = R.curry(function _getSubscription(view, args) {
  if(R.isNil(R.prop(view, SUBSCRIPTIONS))) {
    log.warn(`-- ignoring view "${view}" without subscription`);
    return cellModel.from(null);
  }
  const cell = SUBSCRIPTIONS[view](STATE_CELL, [view, ...args]);
  cell._name = view;
  cell._args = JSON.stringify(R.map((a) => {
    if('Function' === R.type(a)) return '##Fun';
    if('Object' === R.type(a)) return '{Obj}';
    return a;
  }, args));
  CELLS = R.append(cell, CELLS);
  return cell;
});

export function revokeView(cell) {
  CELLS = R.reject((c) => (c === cell), CELLS);
}

export function dispatch([ event, ...args]) {
  return tasksQueueModel
    .push([_dispatch, event, ...args], EVENT_QUEUE);
}

function _dispatch([ resolve, reject, event, ...args]) {
  log.state('>> dispatch', event, args);
  if(R.isNil(R.prop(event, HANDLERS))) {
    log.warn(`-- ignoring event "${event}" without handler`);
    reject('ignored');
    return null;
  }
  try {
    const new_state = HANDLERS[event](STATE, [event, ...args]);
    if(new_state === STATE) {
      resolve();
      return null;
    }
    STATE = new_state;
  }
  catch(e) {
    log.error(`xx error in event "${event}" handler`, e);
    reject(e);
    return null;
  }
  log.state('<< new STATE', STATE);
  TICK = TICK + 1;
  return cellModel.resolveCells(TICK, CELLS)
    .then(resolve);
}
