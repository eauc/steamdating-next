export let __hotReload = true;

import R from 'app/helpers/ramda';
import { coeffects } from 'app/helpers/middlewares/coeffects';
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

registerHandler('players-openCreate', [
  tap,
  coeffects(['history']),
], playersOpenCreateHandler);

registerHandler('players-startEdit', [
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
      { eventName: 'form-reset', formName: 'player', value: {} },
      { eventName: 'players-openCreate' },
    ],
  };
}

export function playersOpenCreateHandler({ history }) {
  history.push('/players/create');
}

export function playersStartEditHandler(_state_, { player }) {
  return {
    dispatch: [
      { eventName: 'form-reset', formName: 'player', value: player },
      { eventName: 'players-openEdit' },
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
      R.assoc('eventName', 'players-update', R.pathOr({}, ['forms', 'player'], state)),
      { eventName: 'players-closeEdit' },
    ],
  };
}

export function playersCreateCurrentEditHandler(state) {
  return {
    dispatch: [
      R.assoc('eventName', 'players-create', R.pathOr({}, ['forms', 'player'], state)),
      { eventName: 'players-closeEdit' },
    ],
  };
}

export function playersRemoveCurrentEditHandler(state) {
  return {
    dispatch: [
      { eventName: 'players-remove', player: R.pathOr({}, ['forms', 'player', 'base'], state) },
      { eventName: 'players-closeEdit' },
    ],
  };
}
