export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch, registerHandler } from 'app/services/state';
import fileService from 'app/services/file';
import tournamentsApiService from 'app/services/apis/tournaments';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import tap from 'app/helpers/middlewares/tap';
import { scope } from 'app/components/tournament/state';

const middlewares = [
  path(scope.tournament, {}),
  stripv,
];

registerHandler('tournament-set',
                [middlewares, tap],
                tournamentSetHandler);
registerHandler('tournament-setConfirm',
                middlewares,
                tournamentSetConfirmHandler);

registerHandler('tournament-open',
                [middlewares, tap],
                tournamentOpenHandler);
registerHandler('tournament-openSuccess',
                middlewares,
                tournamentOpenSuccessHandler);

registerHandler('tournament-onlineRefresh',[
  stripv,
  tap,
], tournamentOnlineRefreshHandler);
registerHandler('tournament-onlineRefreshRequest',[
  stripv,
  tap,
], tournamentOnlineRefreshRequestHandler);
registerHandler('tournament-onlineRefreshSuccess',[
  path(scope.onlineList, []),
  stripv,
], tournamentOnlineRefreshSuccessHandler);
registerHandler('tournament-onlineGetUrlsSuccess',[
  path(scope.onlineUrls, {}),
  stripv,
], tournamentOnlineGetUrlsSuccessHandler);
registerHandler('tournament-onlineSave',[
  stripv,
  tap,
], tournamentOnlineSaveHandler);
registerHandler('tournament-onlineSaveSuccess',
                middlewares,
                tournamentOnlineSaveSuccessHandler);
registerHandler('tournament-onlineDownload',[
  stripv,
  tap,
], tournamentOnlineDownloadHandler);
registerHandler('tournament-onlineDownloadSuccess', [
  middlewares,
  tap,
], tournamentOnlineDownloadSuccessHandler);

export function tournamentSetHandler(_state_, [data]) {
  dispatch(['prompt-set',
            { type: 'confirm',
              msg: 'All previous data will be replaced. You sure ?',
              onOk: ['tournament-setConfirm', data] }]);
}

export function tournamentSetConfirmHandler(_state_, [data]) {
  return data;
}

export function tournamentOpenHandler(_state_, [file]) {
  R.pipeP(
    fileService.readP,
    R.ifElse(
      R.exists,
      (data) => dispatch(['tournament-openSuccess', data]),
      () => dispatch(['toaster-set', { type: 'error',
                                       message: 'Invalid file' }])
    )
  )(file);
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
}

export function tournamentOnlineRefreshRequestHandler(state) {
  const urls = R.path(['online','urls'], state);
  tournamentsApiService.getMineP({
    urls,
    authToken: R.path(['auth','token'], state),
    onSuccess: ['tournament-onlineRefreshSuccess'],
  });
}

export function tournamentOnlineRefreshSuccessHandler(state, [list]) {
  return R.deepMergeArray(list, state);
}

function initOnlineUrlsP(state) {
  const urls = R.path(['online','urls'], state);
  if (R.exists(urls)) {
    return self.Promise.resolve(urls);
  }
  return tournamentsApiService.getUrlsP({
    onSuccess: ['tournament-onlineGetUrlsSuccess'],
  });
}

export function tournamentOnlineGetUrlsSuccessHandler(_state_, [urls]) {
  return urls;
}

export function tournamentOnlineSaveHandler(state, [form]) {
  const tournament = R.thread(state)(
    R.assocPath([...scope.onlineInfo, 'name'], R.path(['edit','name'], form)),
    R.assocPath([...scope.onlineInfo, 'date'], R.path(['edit','date'], form)),
    R.path(scope.tournament)
  );
  tournamentsApiService.saveP({
    urls: R.path(['online','urls'], state),
    authToken: R.path(['auth','token'], state),
    tournament,
    onSuccess: ['tournament-onlineSaveSuccess'],
  });
}

export function tournamentOnlineSaveSuccessHandler(_state_, [tournament]) {
  dispatch(['toaster-set', { type: 'success',
                             message: 'Tournament saved online' }]);
  dispatch(['tournament-onlineRefresh']);
  return tournament;
}

export function tournamentOnlineDownloadHandler(state, [tournament]) {
  tournamentsApiService.loadP({
    tournament,
    authToken: R.path(['auth','token'], state),
    onSuccess: ['tournament-onlineDownloadSuccess'],
  });
}

export function tournamentOnlineDownloadSuccessHandler(_state_, [tournament]) {
  dispatch(['toaster-set', { type: 'success', message: 'Tournament loaded' }]);
  dispatch(['tournament-set', tournament]);
}
