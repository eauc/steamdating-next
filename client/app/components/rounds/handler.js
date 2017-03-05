export let __hotReload = true;

import R from 'app/helpers/ramda';
import { effects } from 'app/helpers/middlewares/effects';
import tap from 'app/helpers/middlewares/tap';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { registerInit } from 'app/services/init';
import { scope as formsScope } from 'app/components/form/state';
import { scope } from 'app/components/rounds/state';
import roundModel from 'app/models/round';
import roundsModel from 'app/models/rounds';

registerHandler('rounds-init', [
  tap,
  effects,
], roundsInitHandler);
registerInit('rounds-init', ['storage-init']);

registerHandler('rounds-startCreate', [
  tap,
  effects,
], roundsStartCreateHandler);

registerHandler('rounds-createCurrentEdit', [
  effects,
], roundsCreateCurrentEditHandler);

registerHandler('rounds-remove', [
  effects,
], roundsRemoveHandler);

registerHandler('rounds-startGameEdit', [
  effects,
], roundsStartGameEditHandler);

registerHandler('rounds-updateCurrentGameEdit', [
  effects,
], roundsUpdateCurrentGameEditHandler);

export function roundsInitHandler(state) {
  return {
    dispatch: {
      eventName: 'form-reset',
      formName: 'round',
      value: roundModel.create(
        { players: R.pathOr([], ['tournament','players'], state) },
        R.pathOr({}, ['forms','round','edit'], state)
      ),
    },
  };
}

export function roundsStartCreateHandler(state) {
  return {
    dispatch: [
      {
        eventName: 'form-reset',
        formName: 'round',
        value: roundModel.create(
          { players: R.pathOr([], ['tournament','players'], state) },
          {}
        ),
      },
      { eventName: 'navigate', to: '/rounds/next' },
    ],
  };
}

export function roundsCreateCurrentEditHandler(state) {
  const edit = R.pathOr({}, [...formsScope, 'round','edit'], state);
  const newState = R.over(R.lensPath(scope), roundsModel.add$(edit), state);
  const newRoundIndex = R.length(R.path(scope, newState)) - 1;
  return {
    state: newState,
    dispatch: [
      {
        eventName: 'form-reset',
        formName: 'round',
        value: roundModel.create(
          { players: R.pathOr([], ['tournament','players'], state) },
          {}
        ),
      },
      { eventName: 'navigate', to: `/rounds/${newRoundIndex}` },
    ],
  };
}

export function roundsRemoveHandler(state, { index }) {
  return {
    state: R.over(R.lensPath(scope), roundsModel.remove$({ index }), state),
    dispatch: { eventName: 'navigate', to: '/rounds/all' },
  };
}

export function roundsStartGameEditHandler(state, { roundIndex, gameIndex }) {
  const game = R.thread(state)(
    R.pathOr({}, scope),
    roundsModel.round$({ index: roundIndex }),
    roundModel.game$({ index: gameIndex })
  );
  return {
    state: R.assocPath(['game','currentEdit'], { roundIndex, gameIndex }, state),
    dispatch: [
      { eventName: 'form-reset', formName: 'game', value: game },
      { eventName: 'navigate', to: '/games/edit' },
    ],
  };
}

export function roundsUpdateCurrentGameEditHandler(state) {
  const game = R.pathOr({}, ['forms','game','edit'], state);
  const { roundIndex, gameIndex } = R.pathOr({}, ['game','currentEdit'], state);
  return {
    state: R.over(
      R.lensPath(scope),
      roundsModel.updateGame$({ game, roundIndex, gameIndex }),
      state
    ),
    dispatch: [
      { eventName: 'form-reset', formName: 'game', value: game },
      { eventName: 'navigate-back' },
    ],
  };
}
