export let __hotReload = true;

import R from 'app/helpers/ramda';
import history from 'app/helpers/history';
import { dispatch, registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import tap from 'app/helpers/middlewares/tap';

import { scope } from 'app/components/players/state';
import playerModel from 'app/models/player';
import playersModel from 'app/models/players';

const middlewares = [
  path(scope, []),
  stripv,
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

registerHandler('players-removeCurrentEdit', [tap], (state) => {
  history.goBack();
  dispatch(['players-remove', R.pathOr({}, ['forms', 'player', 'base'], state)]);
});

registerHandler(
  'players-remove',
  middlewares,
  (state, [player]) => playersModel.remove(player.name, state)
);
