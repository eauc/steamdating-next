export let __hotReload = true;

import R from 'app/helpers/ramda';
import { effects } from 'app/helpers/middlewares/effects';
import path from 'app/helpers/middlewares/path';
import tap from 'app/helpers/middlewares/tap';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { scope } from 'app/components/players/state';
import playerModel from 'app/models/player';
import playersModel from 'app/models/players';

registerHandler('players-create', [
  path(scope, []),
], (state, { edit }) => {
  const player = playerModel.create(edit);
  return playersModel.add(player, state);
});

registerHandler('players-update', [
  path(scope, []),
], (state, { base, edit }) => playersModel.update(base.name, edit, state));

registerHandler('players-remove', [
  path(scope, []),
], (state, { player }) => playersModel.remove(player.name, state));

registerHandler('players-startCreate', [
  tap,
  effects,
], playersStartCreateHandler);

registerHandler('players-startEdit', [
  tap,
  effects,
], playersStartEditHandler);

registerHandler('players-createCurrentEdit', [
  tap,
  effects,
], playersCreateCurrentEditHandler);

registerHandler('players-updateCurrentEdit', [
  tap,
  effects,
], playersUpdateCurrentEditHandler);

registerHandler('players-removeCurrentEdit', [
  tap,
  effects,
], playersRemoveCurrentEditHandler);

export function playersStartCreateHandler() {
  return {
    dispatch: [
      { eventName: 'form-reset', formName: 'player', value: {} },
      { eventName: 'navigate', to: '/players/create' },
    ],
  };
}

export function playersStartEditHandler(state, { player: { name } }) {
  const player = playersModel.player({ name }, R.pathOr([], scope, state));
  return {
    dispatch: [
      { eventName: 'form-reset', formName: 'player', value: player },
      { eventName: 'navigate', to: '/players/edit' },
    ],
  };
}

export function playersUpdateCurrentEditHandler(state) {
  return {
    dispatch: [
      R.assoc('eventName', 'players-update', R.pathOr({}, ['forms', 'player'], state)),
      { eventName: 'navigate-back' },
    ],
  };
}

export function playersCreateCurrentEditHandler(state) {
  return {
    dispatch: [
      R.assoc('eventName', 'players-create', R.pathOr({}, ['forms', 'player'], state)),
      { eventName: 'navigate-back' },
    ],
  };
}

export function playersRemoveCurrentEditHandler(state) {
  return {
    dispatch: [
      { eventName: 'players-remove', player: R.pathOr({}, ['forms', 'player', 'base'], state) },
      { eventName: 'navigate-back' },
    ],
  };
}
