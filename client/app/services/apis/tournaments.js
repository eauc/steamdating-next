export let __hotReload = true;

import R from 'app/helpers/ramda';
import httpService from 'app/services/http';

const tournamentsApiService = {
  getUrlsP: tournamentsApiGetUrlsP,
  getMineP: tournamentsApiGetMineP
};

export default R.curryService(tournamentsApiService);

const TOURNAMENTS_API = R.path(['STEAMDATING_CONFIG','apis','tournaments'], self);

function tournamentsApiGetUrlsP({ onSuccess }) {
  return httpService.getP$({
    url: TOURNAMENTS_API,
    onSuccess: (result) => [ ...onSuccess, R.propOr({}, 'tournaments', result) ],
    onError: ['toaster-set', { type: 'error',
                               message: 'Error accessing server' }]
  });
}

function tournamentsApiGetMineP({ authToken, onSuccess, urls }) {
  return httpService.getP({
    url: `${TOURNAMENTS_API}${R.prop('mine', urls)}`,
    headers: { Authorization: `Bearer ${authToken}` },
    onSuccess: (result) => [ ...onSuccess, R.propOr([], 'data', result) ],
    onError: ['toaster-set', { type: 'error',
                               message: 'Error loading tournaments from server' }]
  });
}
