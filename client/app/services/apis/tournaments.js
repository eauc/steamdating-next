export let __hotReload = true;

import R from 'app/helpers/ramda';
import httpService from 'app/services/http';

const tournamentsApiService = {
  getUrlsP: tournamentsApiGetUrlsP,
  getMineP: tournamentsApiGetMineP,
  loadP: tournamentsApiLoadP,
  saveP: tournamentsApiSaveP,
};

export default R.curryService(tournamentsApiService);

const TOURNAMENTS_API = R.path(['STEAMDATING_CONFIG','apis','tournaments'], self);

function tournamentsApiGetUrlsP({ onSuccess }) {
  return httpService.getP$({
    url: TOURNAMENTS_API,
    onSuccess: (result) => [...onSuccess, R.propOr({}, 'tournaments', result)],
    onError: ['toaster-set', { type: 'error',
                               message: 'Error accessing server' }],
  });
}

function tournamentsApiGetMineP({ authToken, onSuccess, urls }) {
  return httpService.getP({
    url: `${TOURNAMENTS_API}${R.prop('mine', urls)}`,
    headers: { Authorization: `Bearer ${authToken}` },
    onSuccess: (result) => [...onSuccess, R.propOr([], 'data', result)],
    onError: ['toaster-set', { type: 'error',
                               message: 'Error loading tournaments from server' }],
  });
}

function tournamentsApiLoadP({ authToken, onSuccess, tournament }) {
  return httpService.getP({
    url: `${TOURNAMENTS_API}${R.prop('link', tournament)}`,
    headers: { Authorization: `Bearer ${authToken}` },
    onSuccess: (result) => [...onSuccess, R.thread(result)(
      R.propOr({}, 'data'),
      R.assoc('id', R.prop('link', result)),
      (data) => R.thread(data)(
        R.prop('data'),
        R.jsonParse,
        R.defaultTo({}),
        R.assoc('online', R.pick(['name', 'date', 'id', 'updated_at'], data))
      )
    )],
    onError: ['toaster-set', { type: 'error',
                               message: 'Error loading tournament from server' }],
  });
}

function tournamentsApiSaveP({ authToken, onSuccess, tournament, urls }) {
  const data = R.thread(tournament)(
    R.prop('online'),
    R.pick(['name', 'date']),
    R.assoc('data', R.jsonStringify(null, tournament))
  );
  const config = {
    headers: { Authorization: `Bearer ${authToken}` },
    data,
    onSuccess: (result) => [...onSuccess, R.thread(result)(
      R.propOr({}, 'data'),
      R.assoc('id', R.prop('link', result)),
      (data) => R.assoc(
        'online',
        R.pick(['name', 'date', 'id', 'updated_at'], data),
        tournament
      )
    )],
    onError: ['toaster-set', { type: 'error',
                               message: 'Error saving tournament on server' }],
  };
  const id = R.path(['online','id'], tournament);
  if (id) {
    return httpService.putP({
      ...config,
      url: `${TOURNAMENTS_API}${id}`,
    });
  }
  else {
    return httpService.postP({
      ...config,
      url: `${TOURNAMENTS_API}${R.prop('mine', urls)}`,
    });
  }
}
