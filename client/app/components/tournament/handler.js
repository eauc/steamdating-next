export let __hotReload = true;

import R from 'app/helpers/ramda';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import fileService from 'app/services/file';
import tournamentsApiModel from 'app/models/apis/tournaments';
import { effects } from 'app/helpers/middlewares/effects';
import path from 'app/helpers/middlewares/path';
import tap from 'app/helpers/middlewares/tap';
import { scope } from 'app/components/tournament/state';

registerHandler('tournament-set', [
  path(scope.tournament, {}),
  tap,
  effects,
], tournamentSetHandler);
registerHandler('tournament-setConfirm',[
  path(scope.tournament, {}),
], tournamentSetConfirmHandler);

registerHandler('tournament-open', [
  path(scope.tournament, {}),
  tap,
  effects,
], tournamentOpenHandler);
registerHandler('tournament-openSuccess', [
  path(scope.tournament, {}),
  tap,
  effects,
], tournamentOpenSuccessHandler);

registerHandler('tournament-onlineRefresh',[
  tap,
  effects,
], tournamentOnlineRefreshHandler);
registerHandler('tournament-onlineRefreshRequest',[
  tap,
  effects,
], tournamentOnlineRefreshRequestHandler);
registerHandler('tournament-onlineRefreshSuccess',[
  path(scope.onlineList, []),
], tournamentOnlineRefreshSuccessHandler);
registerHandler('tournament-onlineRefreshError',[
  path(scope.onlineList, []),
  effects,
], tournamentOnlineRefreshErrorHandler);
registerHandler('tournament-onlineGetUrlsSuccess',[
  path(scope.onlineUrls, {}),
  effects,
], tournamentOnlineGetUrlsSuccessHandler);
registerHandler('tournament-onlineSave',[
  tap,
  effects,
], tournamentOnlineSaveHandler);
registerHandler('tournament-onlineSaveSuccess', [
  path(scope.tournament, {}),
  effects,
], tournamentOnlineSaveSuccessHandler);
registerHandler('tournament-onlineDownload',[
  tap,
  effects,
], tournamentOnlineDownloadHandler);
registerHandler('tournament-onlineDownloadSuccess', [
  path(scope.tournament, {}),
  tap,
  effects,
], tournamentOnlineDownloadSuccessHandler);

export function tournamentSetHandler(_state_, { tournament }) {
  return {
    dispatch: {
      eventName: 'prompt-set',
      type: 'confirm',
      msg: 'All previous data will be replaced. You sure ?',
      onOk: { eventName: 'tournament-setConfirm', tournament },
    },
  };
}

export function tournamentSetConfirmHandler(_state_, { tournament }) {
  return tournament;
}

export function tournamentOpenHandler(_state_, { file }) {
  return {
    dispatch: R.threadP(file)(
      fileService.readP,
      R.ifElse(
        R.exists,
        (data) => ({ eventName: 'tournament-openSuccess', data }),
        () => ({ eventName: 'toaster-set', type: 'error', message: 'Invalid file' })
      )
    ),
  };
}

export function tournamentOpenSuccessHandler(_state_, { data }) {
  return {
    dispatch: [
      { eventName: 'toaster-set', type: 'success', message: 'File loaded' },
      { eventName: 'tournament-set', tournament: data },
    ],
  };
}

export function tournamentOnlineGetUrlsSuccessHandler(_state_, { urls }) {
  return {
    state: urls,
    dispatch: { eventName: 'tournament-onlineRefreshRequest' },
  };
}

export function tournamentOnlineRefreshHandler(state) {
  const urls = R.path(['online','urls'], state);
  if (R.exists(urls)) {
    return {
      dispatch: { eventName: 'tournament-onlineRefreshRequest' },
    };
  }
  return {
    http: tournamentsApiModel.getUrls({
      onSuccess: { eventName: 'tournament-onlineGetUrlsSuccess' },
      onError: { eventName: 'tournament-onlineRefreshError' },
    }),
  };
}

export function tournamentOnlineRefreshRequestHandler(state) {
  const urls = R.path(['online','urls'], state);
  return {
    http: tournamentsApiModel.getMine({
      urls,
      authToken: R.path(['auth','token'], state),
      onSuccess: { eventName: 'tournament-onlineRefreshSuccess' },
      onError: { eventName: 'tournament-onlineRefreshError' },
    }),
  };
}

export function tournamentOnlineRefreshSuccessHandler(state, { tournaments }) {
  return R.deepMergeArray(tournaments, state);
}

export function tournamentOnlineRefreshErrorHandler() {
  return {
    state: [],
    dispatch: {
      eventName: 'toaster-set',
      type: 'error',
      message: 'Error loading tournaments from server',
    },
  };
}

export function tournamentOnlineSaveHandler(state, { form }) {
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
      onSuccess: { eventName: 'tournament-onlineSaveSuccess' },
    }),
  };
}

export function tournamentOnlineSaveSuccessHandler(
  _state_,
  { tournament }
) {
  return {
    state: tournament,
    dispatch: [
      { eventName: 'toaster-set', type: 'success', message: 'Tournament saved online' },
      { eventName: 'tournament-onlineRefresh' },
    ],
  };
}

export function tournamentOnlineDownloadHandler(state, { tournament }) {
  return {
    http: tournamentsApiModel.load({
      tournament,
      authToken: R.path(['auth','token'], state),
      onSuccess: { eventName: 'tournament-onlineDownloadSuccess' },
    }),
  };
}

export function tournamentOnlineDownloadSuccessHandler(
  _state_,
  { tournament }
) {
  return {
    dispatch: [
      { eventName: 'toaster-set', type: 'success', message: 'Tournament loaded' },
      { eventName: 'tournament-set', tournament },
    ],
  };
}
