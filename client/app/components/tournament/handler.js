export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch, registerHandler } from 'app/services/state';
import fileService from 'app/services/file';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { scope } from 'app/components/tournament/state';

const middlewares = [
  path(scope, {}),
  stripv
];

registerHandler('tournament-open', middlewares, tournamentOpenHandler);
registerHandler('tournament-set', middlewares, tournamentSetHandler);

export function tournamentOpenHandler(state, [file]) {
  R.pipeP(
    fileService.readP,
    R.ifElse(
      R.exists,
      (data) => dispatch(['tournament-set', data]),
      () => dispatch(['error-set', 'Invalid file'])
    )
  )(file);
  return state;
}

export function tournamentSetHandler(_state_, [data]) {
  return data;
}
