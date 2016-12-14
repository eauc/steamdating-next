export let __hotReload = true;

import R from 'app/helpers/ramda';

const tournamentsApiService = {
  getUrls: tournamentsApiGetUrls,
  getMine: tournamentsApiGetMine,
  load: tournamentsApiLoad,
  save: tournamentsApiSave,
};

export default R.curryService(tournamentsApiService);

const TOURNAMENTS_API = R.pathOr(
  '/api/tournaments',
  ['STEAMDATING_CONFIG','apis','tournaments'],
  self
);

function tournamentsApiGetUrls({ onSuccess, onError }) {
  const onErrorEvent = R.exists(onError)
          ? onError
          : ['toaster-set', { type: 'error', message: 'Error accessing server' }];
  return {
    method: 'GET',
    url: TOURNAMENTS_API,
    onSuccess: (httpData) => R.assoc('urls', R.propOr({}, 'tournaments', httpData), onSuccess),
    onError: onErrorEvent,
  };
}

function tournamentsApiGetMine({ authToken, onSuccess, onError, urls }) {
  const onErrorEvent = R.exists(onError)
          ? onError
          : ['toaster-set', { type: 'error', message: 'Error loading tournaments from server' }];
  return {
    method: 'GET',
    url: `${TOURNAMENTS_API}${R.prop('mine', urls)}`,
    headers: { Authorization: `Bearer ${authToken}` },
    onSuccess: (httpData) => R.assoc('tournaments', R.propOr([], 'data', httpData), onSuccess),
    onError: onErrorEvent,
  };
}

function tournamentsApiLoad({ authToken, onSuccess, tournament }) {
  return {
    method: 'GET',
    url: `${TOURNAMENTS_API}${R.prop('link', tournament)}`,
    headers: { Authorization: `Bearer ${authToken}` },
    onSuccess: (httpData) => R.assoc('tournament', R.thread(httpData)(
      R.propOr({}, 'data'),
      R.assoc('id', R.prop('link', httpData)),
      (data) => R.thread(data)(
        R.prop('data'),
        R.jsonParse,
        R.defaultTo({}),
        R.assoc('online', R.pick(['name', 'date', 'id', 'updated_at'], data))
      )
    ), onSuccess),
    onError: {
      eventName: 'toaster-set',
      type: 'error',
      message: 'Error loading tournament from server',
    },
  };
}

function tournamentsApiSave({ authToken, onSuccess, tournament, urls }) {
  const data = R.thread(tournament)(
    R.prop('online'),
    R.pick(['name', 'date']),
    R.assoc('data', R.jsonStringify(null, tournament))
  );
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
    data,
    onSuccess: (httpData) => R.assoc('tournament', R.thread(httpData)(
      R.propOr({}, 'data'),
      R.assoc('id', R.prop('link', httpData)),
      (data) => R.assoc(
        'online',
        R.pick(['name', 'date', 'id', 'updated_at'], data),
        tournament
      )
    ), onSuccess),
    onError: {
      eventName: 'toaster-set',
      type: 'error',
      message: 'Error saving tournament on server',
    },
  };
  const id = R.path(['online','id'], tournament);
  if (id) {
    return {
      ...config,
      method: 'PUT',
      url: `${TOURNAMENTS_API}${id}`,
    };
  }
  else {
    return {
      ...config,
      method: 'POST',
      url: `${TOURNAMENTS_API}${R.prop('mine', urls)}`,
    };
  }
}
