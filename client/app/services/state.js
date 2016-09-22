export let __hotReload = true;

import R from 'app/helpers/ramda';
import Joi from 'joi-browser';
import log from 'app/helpers/log';
import tasksQueueModel from 'app/models/tasksQueue.js';
import cellModel from 'app/models/cell.js';

let TICK = 0;
let STATE = {};
let STATE_HISTORY = [];
let STATE_LOG = [];
const STATE_CELL = cellModel.from(() => STATE);
STATE_CELL._name = 'STATE';
let CELLS = [];
const HANDLERS = {};
const SUBSCRIPTIONS = {};
const VALIDATORS = {};
const EVENT_QUEUE = tasksQueueModel.create();

const stateService = {
  dispatch: stateDispatch
};
export default stateService;
export const dispatch = (...args) => stateService.dispatch(...args);

export function registerValidator(name, path, schema) {
  if(R.prop(name, VALIDATORS)) {
    log.state(`overwriting validator "${name}" `);
  }
  VALIDATORS[name] = (state) => R.thread(state)(
    R.spy('validator', name),
    R.path(path),
    R.spy('validator', name),
    (scope) => schema.validate(scope),
    R.spy('validator', name),
    ({error}) => {
      if(error) log.error(`Validator "${name}" rejected state`, state, path, error);
      return !error;
    },
    R.spy('validator', name)
  );
}

registerValidator('state', [], Joi.object());

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

function stateDispatch([ event, ...args]) {
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
    if(self.STEAMDATING_CONFIG.debug &&
       !R.allPass(R.values(VALIDATORS))(new_state)) {
      if(event !== 'toaster-set') {
        stateDispatch(['toaster-set', {
          type: 'error',
          message: 'Invalid state'
        }]);
      }
      reject('invalid');
      return null;
    }
    STATE = new_state;
    if(self.STEAMDATING_CONFIG.debug) {
      STATE_HISTORY = R.append([event, args, STATE], STATE_HISTORY);
    }
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

function stateToHistoryLast() {
  const [_event_, _args_, restore] = R.last(STATE_HISTORY);
  STATE = restore;
  log.state('<< restore STATE', STATE);
  TICK = TICK + 1;
  cellModel.resolveCells(TICK, CELLS);
}

export const stateDebug = {};

if(self.STEAMDATING_CONFIG.debug) {
  Object.assign(stateDebug, {
    cells: () => {
      console.table(R.map(R.pick(['_name', '_args', '_tick', '_value']), CELLS));
    },
    current: () => {
      return STATE;
    },
    ll: () => {
      console.table(R.map(([event, args]) => [
        event, JSON.stringify(args)
      ], STATE_HISTORY));
    },
    log: () => {
      return STATE_LOG;
    },
    dropLog: (index) => {
      STATE_LOG = R.dropIndex(index, STATE_LOG);
      TICK = TICK + 1;
      cellModel.resolveCells(TICK, CELLS);
    },
    replayLog: (index) => {
      const [event, args] = STATE_LOG[index];
      dispatch([event, ...args]);
    },
    history: () => {
      return STATE_HISTORY;
    },
    dropHistory: (index) => {
      STATE_HISTORY = R.dropIndex(index, STATE_HISTORY);
      stateToHistoryLast();
    },
    replayHistory: (index) => {
      const [event, args] = STATE_HISTORY[index];
      dispatch([event, ...args]);
    },
    first: () => {
      if(1 === R.length(STATE_HISTORY)) return;
      STATE_LOG = R.concat(STATE_LOG, R.reverse(R.tail(STATE_HISTORY)));
      STATE_HISTORY = [R.head(STATE_HISTORY)];
      stateToHistoryLast();
    },
    back: () => {
      if(1 === R.length(STATE_HISTORY)) return;
      const last = R.last(STATE_HISTORY);
      STATE_HISTORY = R.init(STATE_HISTORY);
      STATE_LOG = R.append(last, STATE_LOG);
      stateToHistoryLast();
    },
    redo: () => {
      if(R.isEmpty(STATE_LOG)) return;
      const last = R.last(STATE_LOG);
      STATE_LOG = R.init(STATE_LOG);
      STATE_HISTORY = R.append(last, STATE_HISTORY);
      stateToHistoryLast();
    },
    last: () => {
      if(R.isEmpty(STATE_LOG)) return;
      STATE_HISTORY = R.concat(STATE_HISTORY, R.reverse(STATE_LOG));
      STATE_LOG = [];
      stateToHistoryLast();
    }
  });
}
