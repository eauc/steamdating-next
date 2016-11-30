export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerEffect } from 'app/helpers/middlewares/effects';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';

const httpService = {
  requestP: httpRequestP,
};

export default R.curryService(httpService);

registerEffect('http', httpRequestP);

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json;charset=UTF-8',
};
const httpRequest$ = R.curry(httpRequest);
const loadListener$ = R.curry(loadListener);
const errorListener$ = R.curry(errorListener);
const dispatchSuccess$ = R.curry(dispatchSuccess);
const dispatchError$ = R.curry(dispatchError);

function httpRequestP({ method, url, headers = {}, data, onSuccess, onError }) {
  return new self.Promise(httpRequest$({ method, url, headers, data }))
    .then(dispatchSuccess$({ onSuccess }))
    .catch(dispatchError$({ onError }));
}

function httpRequest({ url, headers, method, data = null }, resolve, reject) {
  const request = new XMLHttpRequest();
  request.addEventListener(
    'load',
    loadListener$({ method, url, headers, resolve, reject })
  );
  request.addEventListener(
    'error',
    errorListener$({ url, reject })
  );
  request.open(method, url, true);
  setHeaders(request, headers);
  if (R.exists(data)) {
    request.send(R.jsonStringify(null, data));
  }
  else {
    request.send();
  }
}

function setHeaders(request, headers) {
  const headersWithDefaults = Object.assign({}, DEFAULT_HEADERS, headers);
  R.forEach((header) => {
    // log.http('request header', header, headersWithDefaults[header]);
    request.setRequestHeader(header, `${headersWithDefaults[header]}`);
  }, R.keys(headersWithDefaults));
}

function loadListener({ method, url, headers, resolve, reject }, evt) {
  const request = evt.currentTarget;
  if (request.status >= 300) {
    const message = request.responseText || request.statusText;
    reject([`GET ${url}: ${message}`, request]);
    return;
  }
  const data = R.jsonParse(request.responseText);
  log.http(`${method} ${url}`, request, headers, data);
  resolve(data);
}

function errorListener({ url, reject }, evt) {
  reject([`GET ${url}: ${evt}`, evt]);
}

function dispatchSuccess({ onSuccess }, data) {
  if (onSuccess) {
    let onSuccessEvent;
    if ('Function' === R.type(onSuccess)) onSuccessEvent = onSuccess(data);
    else onSuccessEvent = R.append(data, onSuccess);
    return dispatch(onSuccessEvent);
  }
  return data;
}

function dispatchError({ onError }, error) {
  const [message, payload] = R.cond([
    [R.equals('Error'), () => [error.message]],
    [R.equals('String'), () => [error]],
    [R.T, () => error],
  ])(R.type(error));
  log.error(message, payload);
  let ret = onError
        ? dispatch(onError)
        : dispatch(['toaster-set', { type: 'error', message }]);
  return ret.then(() => self.Promise.reject(message));
}
