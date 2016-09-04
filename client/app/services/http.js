export let __hotReload = true;

import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { dispatch } from 'app/services/state';

const httpService = {
  getP: getP,
  // postP: postP,
  // putP: putP,
  // deleteP: deleteP
};

export default R.curryService(httpService);

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};
const loadListener$ = R.curry(loadListener);
const errorListener$ = R.curry(errorListener);

function getP({headers = {}, onSuccess, onError}, url) {
  const request = new XMLHttpRequest();
  request.addEventListener('load', loadListener$({url, headers, onSuccess, onError}));
  request.addEventListener('error', errorListener$(url, onError));
  request.open('GET', url, true);
  setHeaders(request, headers);
  request.send();
}

function setHeaders(request, headers) {
  headers = Object.assign({}, DEFAULT_HEADERS, headers);
  R.forEach((header) => {
    request.setRequestHeader(header, headers[header]+'');
  }, R.keys(headers));
}

function loadListener({ url, headers, onSuccess, onError }, evt) {
  const request = evt.currentTarget;
  if(request.status >= 300) {
    const message = request.responseText || request.statusText;
    dispatchError(onError, `GET ${url}: ${message}`, request);
    return;
  }
  try {
    const data = JSON.parse(request.responseText);
    if(onSuccess) {
      dispatch(R.append(data, onSuccess));
    }
    log.http(`GET ${url}`, headers, data);
  }
  catch(e) {
    dispatchError(onError, `GET ${url}: ${e.message}`, e);
  }
}

function errorListener(url, onError, evt) {
  dispatchError(onError, `GET ${url}: ${evt}`, evt);
}

function dispatchError(onError, msg, data) {
  log.error(msg, data);
  if(onError) {
    dispatch(onError);
  }
  else {
    dispatch(['error-set', msg]);
  }
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
