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

registerHandler('tournament-set',
                middlewares,
                tournamentSetHandler);
registerHandler('tournament-setConfirm',
                middlewares,
                tournamentSetConfirmHandler);

registerHandler('tournament-open',
                middlewares,
                tournamentOpenHandler);
registerHandler('tournament-openSuccess',
                middlewares,
                tournamentOpenSuccessHandler);

export function tournamentSetHandler(state, [data]) {
  dispatch(['prompt-set',
            { type: 'confirm',
              msg: 'All previous data will be replaced. You sure ?',
              onOk: ['tournament-setConfirm', data] }]);
  return state;
}

export function tournamentSetConfirmHandler(_state_, [data]) {
  return data;
}

export function tournamentOpenHandler(state, [file]) {
  R.pipeP(
    fileService.readP,
    R.ifElse(
      R.exists,
      (data) => dispatch(['tournament-openSuccess', data]),
      () => dispatch(['toaster-set', { type: 'error',
                                       message: 'Invalid file' }])
    )
  )(file);
  return state;
}

export function tournamentOpenSuccessHandler(state, [data]) {
  dispatch(['toaster-set', { type: 'success', message: 'File loaded' }]);
  dispatch(['tournament-set', data]);
  return state;
}
