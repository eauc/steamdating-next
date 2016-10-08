export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';

const httpService = {
  getP: httpGetP,
  postP: httpPostP,
  putP: httpPutP,
  deleteP: httpDeleteP,
};

export default R.curryService(httpService);

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json;charset=UTF-8',
};
const httpRequest$ = R.curry(httpRequest);
const loadListener$ = R.curry(loadListener);
const errorListener$ = R.curry(errorListener);
const dispatchSuccess$ = R.curry(dispatchSuccess);
const dispatchError$ = R.curry(dispatchError);

function httpGetP({ url, headers = {}, onSuccess, onError }) {
  return new self.Promise(httpRequest$({ method: 'GET', url, headers }))
    .then(dispatchSuccess$({ onSuccess }))
    .catch(dispatchError$({ onError }));
}

function httpPostP({ url, headers = {}, data, onSuccess, onError }) {
  return new self.Promise(httpRequest$({ method: 'POST', url, headers, data }))
    .then(dispatchSuccess$({ onSuccess }))
    .catch(dispatchError$({ onError }));
}

function httpPutP({ url, headers = {}, data, onSuccess, onError }) {
  return new self.Promise(httpRequest$({ method: 'PUT', url, headers, data }))
    .then(dispatchSuccess$({ onSuccess }))
    .catch(dispatchError$({ onError }));
}

function httpDeleteP({ url, headers = {}, onSuccess, onError }) {
  return new self.Promise(httpRequest$({ method: 'DELETE', url, headers }))
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
  const [message, payload] = R.type(error) === 'Error' ? [error.message] : error;
  log.error(message, payload);
  let ret = onError
        ? dispatch(onError)
        : dispatch(['toaster-set', { type: 'error', message }]);
  return ret.then(() => self.Promise.reject(message));
}
