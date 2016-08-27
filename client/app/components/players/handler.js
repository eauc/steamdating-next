export let __hotReload = true;

import { registerHandler } from 'app/services/state';
import history from 'app/helpers/history';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import validate from 'app/helpers/middlewares/validate';

import { scope, schema } from 'app/components/players/state';
import playerModel from '/app/models/player';
import playersModel from '/app/models/players';

const middlewares = [
  path(scope, []),
  validate(schema.players),
  stripv
];

registerHandler('players-create', middlewares, (state, [{edit}]) => {
  const player = playerModel.create(edit);
  history.goBack();
  return playersModel.add(player, state);
});

registerHandler('players-update', middlewares, (state, [{base, edit}]) => {
  history.goBack();
  return playersModel.update(base.name, edit, state);
});
