export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';

const httpService = {
  getP: getP,
  // postP: postP,
  // putP: putP,
  deleteP: deleteP
};

export default R.curryService(httpService);

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};
const httpRequest$ = R.curry(httpRequest);
const loadListener$ = R.curry(loadListener);
const errorListener$ = R.curry(errorListener);
const dispatchSuccess$ = R.curry(dispatchSuccess);
const dispatchError$ = R.curry(dispatchError);

function getP({url, headers = {}, onSuccess, onError}) {
  return new self.Promise(httpRequest$({method: 'GET', url, headers}))
    .then(dispatchSuccess$({onSuccess}))
    .catch(dispatchError$({onError}));
}

function deleteP({url, headers = {}, onSuccess, onError}) {
  return new self.Promise(httpRequest$({method: 'DELETE', url, headers}))
    .then(dispatchSuccess$({onSuccess}))
    .catch(dispatchError$({onError}));
}

function httpRequest({url, headers, method}, resolve, reject) {
  const request = new XMLHttpRequest();
  request.addEventListener(
    'load',
    loadListener$({url, headers, resolve, reject})
  );
  request.addEventListener(
    'error',
    errorListener$({ url, reject })
  );
  request.open(method, url, true);
  setHeaders(request, headers);
  request.send();
}

function setHeaders(request, headers) {
  headers = Object.assign({}, DEFAULT_HEADERS, headers);
  R.forEach((header) => {
    request.setRequestHeader(header, headers[header]+'');
  }, R.keys(headers));
}

function loadListener({ url, headers, resolve, reject }, evt) {
  const request = evt.currentTarget;
  if(request.status >= 300) {
    const message = request.responseText || request.statusText;
    reject([`GET ${url}: ${message}`, request]);
    return;
  }
  const data = R.jsonParse(request.responseText);
  log.http(`GET ${url}`, headers, data);
  resolve(data);
}

function errorListener({url, reject}, evt) {
  reject([`GET ${url}: ${evt}`, evt]);
}

function dispatchSuccess({onSuccess}, data) {
  if(onSuccess) {
    if(R.exists(data)) onSuccess = R.append(data, onSuccess);
    return dispatch(onSuccess);
  }
  return data;
}

function dispatchError({onError}, [message, payload]) {
  log.error(message, payload);
  let ret = onError
        ? dispatch(onError)
        : dispatch(['toaster-set', { type: 'error', message }]);
  return ret.then(() => self.Promise.reject(message));
}

// function postP(url, data, {headers} = {}) {
//   return R.threadP(data)(
//     (data) => JSON.stringify(data),
//     (body) => ({
//       method: 'POST',
//       headers: Object.assign({}, DEFAULT_HEADERS, headers),
//       body: body
//     }),
//     (options) => self.fetch(url, options),
//     checkStatus,
//     (response) => response.json()
//   ).catch(catchError$(url));
// }

// function putP(url, data, {headers} = {}) {
//   return R.threadP(data)(
//     (data) => JSON.stringify(data),
//     (body) => ({
//       method: 'PUT',
//       headers: Object.assign({}, DEFAULT_HEADERS, headers),
//       body: body
//     }),
//     (options) => self.fetch(url, options),
//     checkStatus
//   ).catch(catchError$(url));
// }

// function deleteP(url, {headers} = {}) {
//   return R.threadP()(
//     () => ({
//       method: 'DELETE',
//       headers: Object.assign({}, DEFAULT_HEADERS, headers)
//     }),
//     (options) => self.fetch(url, options),
//     checkStatus
//   ).catch(catchError$(url));
// }
