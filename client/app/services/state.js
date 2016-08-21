export let __hotReload = true;

import R from 'ramda';
import log from 'app/helpers/log';
import tasksQueueModel from 'app/models/tasksQueue.js';
import cellModel from 'app/models/cell.js';

let TICK = 0;
let STATE = {};
const STATE_CELL = cellModel.from(() => STATE);
let CELLS = [];
const HANDLERS = {};
const SUBSCRIPTIONS = {};
const EVENT_QUEUE = tasksQueueModel.create();

export function registerHandler(event, handler) {
  if(R.prop(event, HANDLERS)) {
    log(`overwriting event "${event}" handler`);
  }
  HANDLERS[event] = handler;
}

export function registerSubscription(view, subscription) {
  if(R.prop(view, SUBSCRIPTIONS)) {
    log(`overwriting view "${view}" subscription`);
  }
  SUBSCRIPTIONS[view] = subscription;
}

export function getSubscription([view, ...args]) {
  if(R.isNil(R.prop(view, SUBSCRIPTIONS))) {
    log.warn(`-- ignoring view "${event}" without subscription`);
    return cellModel.from(null);
  }
  const cell = STATE_CELL.map(SUBSCRIPTIONS[view]([view, ...args]));
  CELLS = R.append(cell, CELLS);
  return cell;
}

export function revokeSubscription(cell) {
  CELLS = R.reject((c) => (c === cell), CELLS);
}

export function dispatch([ event, ...args]) {
  return tasksQueueModel
    .push([_dispatch, event, ...args], EVENT_QUEUE);
}

function _dispatch([ resolve, reject, event, ...args]) {
  log.info('>> dispatch', event, args);
  if(R.isNil(R.prop(event, HANDLERS))) {
    log.warn(`-- ignoring event "${event}" without handler`);
    reject('ignored');
    return null;
  }
  log(`-- handling event "${event}"`, args);
  try {
    STATE = HANDLERS[event](STATE, [event, ...args]);
  }
  catch(e) {
    log.error(`xx error in event "${event}" handler`, e);
    reject(e);
    return null;
  }
  log.info('<< new STATE', STATE);
  TICK = TICK + 1;
  return cellModel.resolveCells(TICK, CELLS)
    .then(() => {
      STATE_CELL.resetTick(TICK);
      resolve();
    });
}
