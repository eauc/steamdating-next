export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { registerEffect } from 'app/helpers/middlewares/effects';
import cellModel from 'app/models/cell.js';
import subscriptionsModel from 'app/models/subscriptions.js';
import stateModel from 'app/models/state.js';
import tasksQueueModel from 'app/models/tasksQueue.js';

const stateDebug = {};
const stateService = {
  stateDebug,
  dispatch: stateDispatch,
  registerValidator,
  registerHandler,
  registerSubscription,
  getPermanentSubscription,
  revokeView,
};
export default stateService;
// export const dispatch = (...args) => stateService.dispatch(...args);

let STATE_CONTEXT = stateModel.createContext();
let SUBSCRIPTIONS_CONTEXT = subscriptionsModel.createContext();
const STATE_CELL = cellModel.from(() => STATE_CONTEXT.STATE);
STATE_CELL._name = 'STATE';
const EVENT_QUEUE = tasksQueueModel.create();

registerValidator('state', [], { type: 'object' });
registerEffect('dispatch', (events) => {
  const eventsArray = R.type(events[0]) === 'Array' ? events : [events];
  R.thread(eventsArray)(
    R.map((event) => self.Promise.resolve(event).catch(() => null)),
    (eventsPromises) => self.Promise.all(eventsPromises),
    (promise) => promise.then(R.pipe(
      R.reject(R.isNil),
      R.forEach((event) => stateService.dispatch(event))
    ))
  );
});

function registerValidator(name, path, schema) {
  STATE_CONTEXT = stateModel
    .registerValidator(name, path, schema, STATE_CONTEXT);
}

function registerHandler(event, ...args) {
  STATE_CONTEXT = stateModel
    .registerHandler(event, args, STATE_CONTEXT);
}

function registerSubscription(view, subscription) {
  SUBSCRIPTIONS_CONTEXT = subscriptionsModel
    .registerSubscription(view, subscription, SUBSCRIPTIONS_CONTEXT);
  return getSubscription$(view);
}

export function getPermanentSubscription(name, [view, ...args]) {
  self._views = self._views || {};
  if (self._views[name]) {
    log.sub('permanentSub revoke', name);
    revokeView(self._views[name]);
  }
  log.sub('permanentSub get', name, args);
  self._views[name] = view(args);
}

export function revokeView(cell) {
  SUBSCRIPTIONS_CONTEXT = subscriptionsModel
    .revokeView(cell, SUBSCRIPTIONS_CONTEXT);
}

function stateDispatch([event, ...args]) {
  return tasksQueueModel
    .push([_dispatch, event, ...args], EVENT_QUEUE);
}

function _dispatch([resolve, reject, event, ...args]) {
  log.state('>> dispatch', event, args);
  return stateModel
    .resolveEvent([event, args], STATE_CONTEXT)
    .catch((error) => {
      if (event !== 'toaster-set') {
        stateDispatch(['toaster-set', {
          type: 'error',
          message: error,
        }]);
      }
      return self.Promise.reject(error);
    })
    .then((newStateContext) => {
      if (newStateContext === STATE_CONTEXT) {
        return STATE_CONTEXT;
      }
      // update CONTEXT is necessary
      // for STATE_CELL to be resolved correctly
      STATE_CONTEXT = newStateContext;
      log.state('<< new STATE', STATE_CONTEXT.STATE);
      return resolveCells();
    })
    .then(resolve)
    .catch(reject);
}

const getSubscription$ = R.curry(function getSubscription(view, args) {
  const { cell, context } = subscriptionsModel
          .getSubscription(view, args, STATE_CELL, SUBSCRIPTIONS_CONTEXT);
  SUBSCRIPTIONS_CONTEXT = context;
  return cell;
});

function resolveCells() {
  return subscriptionsModel
    .resolveCells(SUBSCRIPTIONS_CONTEXT)
    .then(() => {
      SUBSCRIPTIONS_CONTEXT = subscriptionsModel
        .advanceTick(SUBSCRIPTIONS_CONTEXT);
    });
}

if (self.STEAMDATING_CONFIG.debug) {
  Object.assign(stateDebug, {
    cells: () => {
      console.table(R.map(cellModel.dump, SUBSCRIPTIONS_CONTEXT.CELLS));
    },
    current: () => STATE_CONTEXT.STATE,
    ll: () => {
      console.table(R.map(([event, args]) => [
        event, JSON.stringify(args),
      ], STATE_CONTEXT.STATE_HISTORY));
    },
    log: () => STATE_CONTEXT.STATE_LOG,
    dropLog: (index) => {
      STATE_CONTEXT = stateModel.dropLog(index, STATE_CONTEXT);
      resolveCells();
    },
    replayLog: (index) => {
      const [event, args] = STATE_CONTEXT.STATE_LOG[index];
      stateService.dispatch([event, ...args]);
    },
    history: () => STATE_CONTEXT.STATE_HISTORY,
    dropHistory: (index) => {
      STATE_CONTEXT = stateModel.dropHistory(index, STATE_CONTEXT);
      resolveCells();
    },
    replayHistory: (index) => {
      const [event, args] = STATE_CONTEXT.STATE_HISTORY[index];
      stateService.dispatch([event, ...args]);
    },
    first: () => {
      STATE_CONTEXT = stateModel.first(STATE_CONTEXT);
      resolveCells();
    },
    back: () => {
      STATE_CONTEXT = stateModel.back(STATE_CONTEXT);
      resolveCells();
    },
    redo: () => {
      STATE_CONTEXT = stateModel.redo(STATE_CONTEXT);
      resolveCells();
    },
    last: () => {
      STATE_CONTEXT = stateModel.last(STATE_CONTEXT);
      resolveCells();
    },
  });
}
