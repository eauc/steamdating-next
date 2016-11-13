export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import cellModel from 'app/models/cell.js';

const stateModel = {
  createContext: stateCreateContext,
  registerHandler: stateRegisterHandler,
  registerSubscription: stateRegisterSubscription,
  registerValidator: stateRegisterValidator,
  getSubscription: stateGetSubscription,
  revokeView: stateRevokeView,
  resolveEvent: stateResolveEvent,
  resolveCells: stateResolveCells,
  dropLog: stateDropLog,
  dropHistory: stateDropHistory,
  first: stateFirst,
  back: stateBack,
  redo: stateRedo,
  last: stateLast,
};
export default R.curryService(stateModel);

function stateCreateContext() {
  return {
    TICK: 0,
    STATE: {},
    STATE_HISTORY: [],
    STATE_LOG: [],
    CELLS: [],
    HANDLERS: {},
    SUBSCRIPTIONS: {},
    VALIDATORS: {},
  };
}

function stateRegisterValidator(name, path, schema, context) {
  if (R.prop(name, context.VALIDATORS)) {
    log.state(`overwriting validator "${name}" `);
  }
  return R.assocPath(
    ['VALIDATORS',name],
    validateNextState$(name, path, schema),
    context
  );
}

const validateNextState$ = R.curry(function val(name, path, schema, state) {
  return R.thread(state)(
    R.spy('validator', name),
    R.path(path),
    R.spy('validator', name),
    (scope) => schema.validate(scope),
    R.spy('validator', name),
    ({ error }) => {
      if (error) log.error(`Validator "${name}" rejected state`, state, path, error);
      return !error;
    },
    R.spy('validator', name)
  );
});

function stateRegisterHandler(event, args, context) {
  if (R.prop(event, context.HANDLERS)) {
    log.state(`overwriting event "${event}" handler`);
  }
  if (args.length === 1) {
    const [handler] = args;
    return R.assocPath(
      ['HANDLERS', event],
      handler,
      context
    );
  }
  else {
    const [middlewares, handler] = args;
    return R.assocPath(
      ['HANDLERS', event],
      R.apply(R.compose, R.flatten(middlewares))(handler),
      context
    );
  }
}

function stateRegisterSubscription(view, subscription, context) {
  if (R.prop(view, context.SUBSCRIPTIONS)) {
    log.state(`overwriting view "${view}" subscription`);
  }
  return R.assocPath(
    ['SUBSCRIPTIONS', view],
    subscription,
    context
  );
}

function stateGetSubscription(view, args, stateCell, context) {
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

function stateRevokeView(cell, context) {
  return R.over(
    R.lensProp('CELLS'),
    R.reject((_cell) => (_cell === cell)),
    context
  );
}

function stateResolveEvent([event, args], context) {
  return new self.Promise((resolve, reject) => {
    let newContext = context;
    if (R.isNil(R.prop(event, context.HANDLERS))) {
      log.warn(`-- ignoring event "${event}" without handler`);
      return reject('Event Ignored');
    }
    try {
      const newState = context.HANDLERS[event](context.STATE, [event, ...args]);
      if (newState === context.STATE) {
        return resolve(newContext);
      }
      if (self.STEAMDATING_CONFIG.debug &&
          !R.allPass(R.values(context.VALIDATORS))(newState)) {
        return reject('Invalid State');
      }
      newContext = R.assoc('STATE', newState, newContext);
      if (self.STEAMDATING_CONFIG.debug) {
        newContext = R.over(
          R.lensProp('STATE_HISTORY'),
          R.append([event, args, newContext.STATE]),
          newContext
        );
      }
    }
    catch (error) {
      log.error(`xx error in event "${event}" handler`, error);
      return reject('Error in Event Handler');
    }
    return resolve(newContext);
  });
}

function stateResolveCells(context) {
  return R.thread(context)(
    R.over(
      R.lensProp('TICK'),
      R.inc
    ),
    (context) => cellModel
      .resolveCells(context.TICK, context.CELLS)
      .then(() => context)
  );
}

function stateToHistoryLast(context) {
  const [_event_, _args_, restore] = R.last(context.STATE_HISTORY);
  let newContext = R.assoc('STATE', restore, context);
  log.state('<< restore STATE', newContext.STATE);
  return newContext;
}

function stateDropLog(index, context) {
  return R.over(
    R.lensProp('STATE_LOG'),
    R.dropIndex(index),
    context
  );
}

function stateDropHistory(index, context) {
  return R.thread(context)(
    R.over(
      R.lensProp('STATE_HISTORY'),
      R.dropIndex(index)
    ),
    stateToHistoryLast
  );
}

function stateFirst(context) {
  if (1 === R.length(context.STATE_HISTORY)) return context;
  return R.thread(context)(
    R.over(
      R.lensProp('STATE_LOG'),
      R.concat(R.__, R.reverse(R.tail(context.STATE_HISTORY)))
    ),
    R.assoc('STATE_HISTORY', [R.head(context.STATE_HISTORY)]),
    stateToHistoryLast
  );
}

function stateBack(context) {
  if (1 === R.length(context.STATE_HISTORY)) return context;
  const last = R.last(context.STATE_HISTORY);
  return R.thread(context)(
    R.over(R.lensProp('STATE_HISTORY'), R.init),
    R.over(R.lensProp('STATE_LOG'), R.append(last)),
    stateToHistoryLast
  );
}

function stateRedo(context) {
  if (R.isEmpty(context.STATE_LOG)) return context;
  const last = R.last(context.STATE_LOG);
  return R.thread(context)(
    R.over(R.lensProp('STATE_LOG'), R.init),
    R.over(R.lensProp('STATE_HISTORY'), R.append(last)),
    stateToHistoryLast
  );
}

function stateLast(context) {
  if (R.isEmpty(context.STATE_LOG)) return context;
  return R.thread(context)(
    R.over(
      R.lensProp('STATE_HISTORY'),
      R.concat(R.__, R.reverse(context.STATE_LOG))
    ),
    R.assoc('STATE_LOG', []),
    stateToHistoryLast
  );
}