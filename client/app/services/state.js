export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { registerEffect } from 'app/helpers/middlewares/effects';
import cellModel from 'app/models/cell.js';
import stateModel from 'app/models/state.js';
import tasksQueueModel from 'app/models/tasksQueue.js';

let CONTEXT = stateModel.createContext();
const STATE_CELL = cellModel.from(() => CONTEXT.STATE);
STATE_CELL._name = 'STATE';
const EVENT_QUEUE = tasksQueueModel.create();
registerValidator('state', [], { type: 'object' });

const stateService = {
  dispatch: stateDispatch,
};
export default stateService;
export const dispatch = (...args) => stateService.dispatch(...args);

registerEffect('dispatch', (events) => {
  const eventsArray = R.type(events[0]) === 'Array' ? events : [events];
	R.thread(eventsArray)(
		R.map((event) => self.Promise.resolve(event).catch(() => null)),
		(eventsPromises) => self.Promise.all(eventsPromises),
		(promise) => promise.then(R.compose(R.forEach(stateService.dispatch), R.reject(R.isNil)))
	);
});

export function registerValidator(name, path, schema) {
  CONTEXT = stateModel.registerValidator(name, path, schema, CONTEXT);
}

export function registerHandler(event, ...args) {
  CONTEXT = stateModel.registerHandler(event, args, CONTEXT);
}

export function registerSubscription(view, subscription) {
  CONTEXT = stateModel
    .registerSubscription(view, subscription, CONTEXT);
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
  CONTEXT = stateModel.revokeView(cell, CONTEXT);
}

function stateDispatch([event, ...args]) {
  return tasksQueueModel
    .push([_dispatch, event, ...args], EVENT_QUEUE);
}

function _dispatch([resolve, reject, event, ...args]) {
  log.state('>> dispatch', event, args);
  return stateModel
    .resolveEvent([event, args], CONTEXT)
    .catch((error) => {
      if (event !== 'toaster-set') {
        stateDispatch(['toaster-set', {
          type: 'error',
          message: error,
        }]);
      }
      return self.Promise.reject(error);
    })
    .then((newContext) => {
      if (newContext === CONTEXT) {
        return CONTEXT;
      }
      // update CONTEXT is necessary
      // for STATE_CELL to be resolved correctly
      CONTEXT = newContext;
      log.state('<< new STATE', CONTEXT.STATE);
      return stateModel.resolveCells(CONTEXT);
    })
    .then(R.tap((newContext) => {
      CONTEXT.TICK = newContext.TICK;
    }))
    .then(resolve)
    .catch(reject);
}

const getSubscription$ = R.curry(function getSubscription(view, args) {
  const { cell, context } = stateModel
          .getSubscription(view, args, STATE_CELL, CONTEXT);
  CONTEXT = context;
  return cell;
});

export const stateDebug = {};

if (self.STEAMDATING_CONFIG.debug) {
  Object.assign(stateDebug, {
    cells: () => {
      console.table(R.map(cellModel.dump, CONTEXT.CELLS));
    },
    current: () => CONTEXT.STATE,
    ll: () => {
      console.table(R.map(([event, args]) => [
        event, JSON.stringify(args),
      ], CONTEXT.STATE_HISTORY));
    },
    log: () => CONTEXT.STATE_LOG,
    dropLog: (index) => {
      CONTEXT = stateModel.dropLog(index, CONTEXT);
      stateModel.resolveCells(CONTEXT);
    },
    replayLog: (index) => {
      const [event, args] = CONTEXT.STATE_LOG[index];
      dispatch([event, ...args]);
    },
    history: () => CONTEXT.STATE_HISTORY,
    dropHistory: (index) => {
      CONTEXT = stateModel.dropHistory(index, CONTEXT);
      stateModel.resolveCells(CONTEXT);
    },
    replayHistory: (index) => {
      const [event, args] = CONTEXT.STATE_HISTORY[index];
      dispatch([event, ...args]);
    },
    first: () => {
      CONTEXT = stateModel.first(CONTEXT);
      stateModel.resolveCells(CONTEXT);
    },
    back: () => {
      CONTEXT = stateModel.back(CONTEXT);
      stateModel.resolveCells(CONTEXT);
    },
    redo: () => {
      CONTEXT = stateModel.redo(CONTEXT);
      stateModel.resolveCells(CONTEXT);
    },
    last: () => {
      CONTEXT = stateModel.last(CONTEXT);
      stateModel.resolveCells(CONTEXT);
    },
  });
}
