export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch, registerHandler } from 'app/services/state';
import fileService from 'app/services/file';
import tournamentsApiService from 'app/services/apis/tournaments';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import { scope } from 'app/components/tournament/state';

const middlewares = [
  path(scope.tournament, {}),
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

registerHandler('tournament-onlineRefresh',[
  stripv
], tournamentOnlineRefreshHandler);
registerHandler('tournament-onlineRefreshRequest',[
  stripv
], tournamentOnlineRefreshRequestHandler);
registerHandler('tournament-onlineRefreshSuccess',[
  path(scope.online_list, []),
  stripv
], tournamentOnlineRefreshSuccessHandler);
registerHandler('tournament-onlineGetUrlsSuccess',[
  path(scope.online_urls, {}),
  stripv
], tournamentOnlineGetUrlsSuccessHandler);

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

export function tournamentOnlineRefreshHandler(state) {
  R.pipeP(
    initOnlineUrlsP,
    () => dispatch(['tournament-onlineRefreshRequest'])
  )(state);
  return state;
}

export function tournamentOnlineRefreshRequestHandler(state) {
  const urls = R.path(['online','urls'], state);
  tournamentsApiService.getMineP({
    urls,
    authToken: R.path(['auth','token'], state),
    onSuccess: ['tournament-onlineRefreshSuccess']
  });
  return R.assocPath(['online', 'list'], [], state);
}

export function tournamentOnlineRefreshSuccessHandler(_state_, [list]) {
  return list;
}

function initOnlineUrlsP(state) {
  const urls = R.path(['online','urls'], state);
  if(R.exists(urls)) {
    return self.Promise.resolve(urls);
  }
  return tournamentsApiService.getUrlsP({
    onSuccess: ['tournament-onlineGetUrlsSuccess']
  });
}

export function tournamentOnlineGetUrlsSuccessHandler(_state_, [urls]) {
  return urls;
}

