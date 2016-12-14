export let __hotReload = true;

import R from 'app/helpers/ramda';
import ajv from 'app/helpers/ajv';
import log from 'app/helpers/log';

const stateModel = {
  createContext: stateCreateContext,
  registerHandler: stateRegisterHandler,
  registerValidator: stateRegisterValidator,
  resolveEvent: stateResolveEvent,
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
    STATE: {},
    STATE_HISTORY: [],
    STATE_LOG: [],
    HANDLERS: {},
    VALIDATORS: {},
  };
}

function stateRegisterValidator(name, path, schema, context) {
  if (R.prop(name, context.VALIDATORS)) {
    log.state(`overwriting validator "${name}" `);
  }
  const schemaOrNull = {
    oneOf: [
      { type: 'null' },
      schema,
    ],
  };
  return R.assocPath(
    ['VALIDATORS',name],
    validateNextState$(name, path, schemaOrNull),
    context
  );
}

const validateNextState$ = R.curry(function val(name, path, schema, state) {
  const validate = ajv.compile(schema);
  return R.thread(state)(
    R.pathOr(null, path),
    validate,
    R.tap((valid) => {
      if (!valid) {
        log.error(
          `Validator "${name}" rejected state`,
          state, path, validate.errors
        );
      }
    }),
    R.spy('validator', name, path, schema, validate.errors)
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

function stateResolveEvent(event, context) {
  const { eventName } = event;
  return new self.Promise((resolve, reject) => {
    let newContext = context;
    if (R.isNil(R.prop(eventName, context.HANDLERS))) {
      log.warn(`-- ignoring event "${eventName}" without handler`);
      return reject('Event Ignored');
    }
    try {
      const newState = context.HANDLERS[eventName](context.STATE, event);
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
          R.append([event, newContext.STATE]),
          newContext
        );
      }
    }
    catch (error) {
      log.error(`xx error in event "${eventName}" handler`, error);
      return reject('Error in Event Handler');
    }
    return resolve(newContext);
  });
}

function stateToHistoryLast(context) {
  const [_event_, restore] = R.last(context.STATE_HISTORY);
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
