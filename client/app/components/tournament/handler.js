export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerHandler } from 'app/services/state';
import fileService from 'app/services/file';
import tournamentsApiModel from 'app/models/apis/tournaments';
import { effects } from 'app/helpers/middlewares/effects';
import path from 'app/helpers/middlewares/path';
import stripEvent from 'app/helpers/middlewares/stripEvent';
import tap from 'app/helpers/middlewares/tap';
import { scope } from 'app/components/tournament/state';

const middlewares = [
  path(scope.tournament, {}),
  stripEvent,
];

registerHandler('tournament-set', [
  middlewares,
  tap,
  effects,
], tournamentSetHandler);
registerHandler(
  'tournament-setConfirm',
  middlewares,
  tournamentSetConfirmHandler
);

registerHandler('tournament-open', [
  middlewares,
  tap,
  effects,
], tournamentOpenHandler);
registerHandler('tournament-openSuccess', [
  middlewares,
  tap,
  effects,
], tournamentOpenSuccessHandler);

registerHandler('tournament-onlineRefresh',[
  stripEvent,
  tap,
  effects,
], tournamentOnlineRefreshHandler);
registerHandler('tournament-onlineRefreshRequest',[
  stripEvent,
  tap,
  effects,
], tournamentOnlineRefreshRequestHandler);
registerHandler('tournament-onlineRefreshSuccess',[
  path(scope.onlineList, []),
  stripEvent,
], tournamentOnlineRefreshSuccessHandler);
registerHandler('tournament-onlineRefreshError',[
  path(scope.onlineList, []),
  stripEvent,
  effects,
], tournamentOnlineRefreshErrorHandler);
registerHandler('tournament-onlineGetUrlsSuccess',[
  path(scope.onlineUrls, {}),
  stripEvent,
  effects,
], tournamentOnlineGetUrlsSuccessHandler);
registerHandler('tournament-onlineSave',[
  stripEvent,
  tap,
  effects,
], tournamentOnlineSaveHandler);
registerHandler('tournament-onlineSaveSuccess', [
  middlewares,
  effects,
], tournamentOnlineSaveSuccessHandler);
registerHandler('tournament-onlineDownload',[
  stripEvent,
  tap,
  effects,
], tournamentOnlineDownloadHandler);
registerHandler('tournament-onlineDownloadSuccess', [
  middlewares,
  tap,
  effects,
], tournamentOnlineDownloadSuccessHandler);

export function tournamentSetHandler(_state_, [data]) {
  return {
    dispatch: [
      'prompt-set',
      { type: 'confirm',
        msg: 'All previous data will be replaced. You sure ?',
        onOk: ['tournament-setConfirm', data] },
    ],
  };
}

export function tournamentSetConfirmHandler(_state_, [data]) {
  return data;
}

export function tournamentOpenHandler(_state_, [file]) {
  return {
    dispatch: R.threadP(file)(
      fileService.readP,
      R.ifElse(
        R.exists,
        (data) => ['tournament-openSuccess', data],
        () => ['toaster-set', { type: 'error', message: 'Invalid file' }]
      )
    ),
  };
}

export function tournamentOpenSuccessHandler(_state_, [data]) {
  return {
    dispatch: [
      ['toaster-set', { type: 'success', message: 'File loaded' }],
      ['tournament-set', data],
    ],
  };
}

export function tournamentOnlineGetUrlsSuccessHandler(_state_, [urls]) {
  return {
    state: urls,
    dispatch: ['tournament-onlineRefreshRequest'],
  };
}

export function tournamentOnlineRefreshHandler(state) {
  const urls = R.path(['online','urls'], state);
  if (R.exists(urls)) {
    return {
      dispatch: ['tournament-onlineRefreshRequest'],
    };
  }
  return {
    http: tournamentsApiModel.getUrls({
      onSuccess: ['tournament-onlineGetUrlsSuccess'],
      onError: ['tournament-onlineRefreshError'],
    }),
  };
}

export function tournamentOnlineRefreshRequestHandler(state) {
  const urls = R.path(['online','urls'], state);
  return {
    http: tournamentsApiModel.getMine({
      urls,
      authToken: R.path(['auth','token'], state),
      onSuccess: ['tournament-onlineRefreshSuccess'],
      onError: ['tournament-onlineRefreshError'],
    }),
  };
}

export function tournamentOnlineRefreshSuccessHandler(state, [list]) {
  return R.deepMergeArray(list, state);
}

export function tournamentOnlineRefreshErrorHandler() {
  return {
    state: [],
    dispatch: [
      'toaster-set',
      {
        type: 'error',
        message: 'Error loading tournaments from server',
      },
    ],
  };
}

export function tournamentOnlineSaveHandler(state, [form]) {
  const tournament = R.thread(state)(
    R.assocPath([...scope.onlineInfo, 'name'], R.path(['edit','name'], form)),
    R.assocPath([...scope.onlineInfo, 'date'], R.path(['edit','date'], form)),
    R.path(scope.tournament)
  );
  return {
    http: tournamentsApiModel.save({
      urls: R.path(['online','urls'], state),
      authToken: R.path(['auth','token'], state),
      tournament,
      onSuccess: ['tournament-onlineSaveSuccess'],
    }),
  };
}

export function tournamentOnlineSaveSuccessHandler(_state_, [tournament]) {
  return {
    state: tournament,
    dispatch: [
      ['toaster-set', { type: 'success', message: 'Tournament saved online' }],
      ['tournament-onlineRefresh'],
    ],
  };
}

export function tournamentOnlineDownloadHandler(state, [tournament]) {
  return {
    http: tournamentsApiModel.load({
      tournament,
      authToken: R.path(['auth','token'], state),
      onSuccess: ['tournament-onlineDownloadSuccess'],
    }),
  };
}

export function tournamentOnlineDownloadSuccessHandler(_state_, [tournament]) {
  return {
    dispatch: [
      ['toaster-set', { type: 'success', message: 'Tournament loaded' }],
      ['tournament-set', tournament],
    ],
  };
}
