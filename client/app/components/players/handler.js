export let __hotReload = true;

import R from 'app/helpers/ramda';
import { coeffects } from 'app/helpers/middlewares/coeffects';
import { effects } from 'app/helpers/middlewares/effects';
import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import tap from 'app/helpers/middlewares/tap';
import { registerHandler } from 'app/services/state';
import { scope } from 'app/components/players/state';
import playerModel from 'app/models/player';
import playersModel from 'app/models/players';

const middlewares = [
  path(scope, []),
  stripEvent,
];

registerHandler('players-create', middlewares, (state, [{ edit }]) => {
  const player = playerModel.create(edit);
  return playersModel.add(player, state);
});

registerHandler(
  'players-update',
  middlewares,
  (state, [{ base, edit }]) => playersModel.update(base.name, edit, state)
);

registerHandler(
  'players-remove',
  middlewares,
  (state, [player]) => playersModel.remove(player.name, state)
);

registerHandler('players-startCreate', [
  tap,
  effects,
], playersStartCreateHandler);

registerHandler('players-openCreate', [
  tap,
  coeffects(['history']),
], playersOpenCreateHandler);

registerHandler('players-startEdit', [
  stripEvent,
  tap,
  effects,
], playersStartEditHandler);

registerHandler('players-openEdit', [
  tap,
  coeffects(['history']),
], playersOpenEditHandler);

registerHandler('players-closeEdit', [
  tap,
  coeffects(['history']),
], playersCloseEditHandler);

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
      ['form-reset', 'player', {}],
      ['players-openCreate'],
    ],
  };
}

export function playersOpenCreateHandler({ history }) {
  history.push('/players/create');
}

export function playersStartEditHandler(_state_, [player]) {
  return {
    dispatch: [
      ['form-reset', 'player', player],
      ['players-openEdit'],
    ],
  };
}

export function playersOpenEditHandler({ history }) {
  history.push('/players/edit');
}

export function playersCloseEditHandler({ history }) {
  history.goBack();
}

export function playersUpdateCurrentEditHandler(state) {
  return {
    dispatch: [
      ['players-update', R.pathOr({}, ['forms', 'player'], state)],
      ['players-closeEdit'],
    ],
  };
}

export function playersCreateCurrentEditHandler(state) {
  return {
    dispatch: [
      ['players-create', R.pathOr({}, ['forms', 'player'], state)],
      ['players-closeEdit'],
    ],
  };
}

export function playersRemoveCurrentEditHandler(state) {
  return {
    dispatch: [
      ['players-remove', R.pathOr({}, ['forms', 'player', 'base'], state)],
      ['players-closeEdit'],
    ],
  };
}
