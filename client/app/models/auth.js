export let __hotReload = true;

import R from 'app/helpers/ramda';

const authModel = {
  create: authCreate,
  reset: authReset,
  getToken: authGetToken,
  setToken: authSetToken,
  isActive: authIsActive,
};

export default R.curryService(authModel);

function authCreate(data) {
  return Object.assign({ token: null }, data);
}

function authReset(auth) {
  return R.assoc('token', null, auth);
}

function authGetToken(auth) {
  return R.prop('token', auth);
}

function authSetToken(token, auth) {
  return R.assoc('token', token, auth);
}

function authIsActive(auth) {
  const token = R.propOr(null, 'token', auth);
  return (R.type(token) === 'String' &&
          !R.isEmpty(token));
}
