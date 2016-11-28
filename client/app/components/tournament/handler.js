export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerHandler } from 'app/services/state';
import fileService from 'app/services/file';
import tournamentsApiService from 'app/services/apis/tournaments';
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
], tournamentOnlineRefreshRequestHandler);
registerHandler('tournament-onlineRefreshSuccess',[
  path(scope.onlineList, []),
  stripEvent,
], tournamentOnlineRefreshSuccessHandler);
registerHandler('tournament-onlineGetUrlsSuccess',[
  path(scope.onlineUrls, {}),
  stripEvent,
], tournamentOnlineGetUrlsSuccessHandler);
registerHandler('tournament-onlineSave',[
  stripEvent,
  tap,
], tournamentOnlineSaveHandler);
registerHandler('tournament-onlineSaveSuccess', [
  middlewares,
  effects,
], tournamentOnlineSaveSuccessHandler);
registerHandler('tournament-onlineDownload',[
  stripEvent,
  tap,
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

export function tournamentOnlineRefreshHandler(state) {
  return {
		dispatch: R.threadP(state)(
			initOnlineUrlsP,
			() => ['tournament-onlineRefreshRequest']
		),
	};
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
  return {
    state: tournament,
    dispatch: [
      ['toaster-set', { type: 'success', message: 'Tournament saved online' }],
      ['tournament-onlineRefresh'],
    ],
  };
}

export function tournamentOnlineDownloadHandler(state, [tournament]) {
  tournamentsApiService.loadP({
    tournament,
    authToken: R.path(['auth','token'], state),
    onSuccess: ['tournament-onlineDownloadSuccess'],
  });
}

export function tournamentOnlineDownloadSuccessHandler(_state_, [tournament]) {
  return {
    dispatch: [
      ['toaster-set', { type: 'success', message: 'Tournament loaded' }],
      ['tournament-set', tournament],
    ],
  };
}
