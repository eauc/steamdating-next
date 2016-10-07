export let __hotReload = true;

import R from 'app/helpers/ramda';
import { registerHandler } from 'app/services/state';
import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import tap from 'app/helpers/middlewares/tap';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import { scope, tokenSchema, authLogin } from 'app/components/auth/state';

const middlewares = [
  path(scope, {}),
  stripv,
];

registerHandler('auth-signin', [
  middlewares,
  tap,
], authSigninHandler);
registerHandler('auth-signout', middlewares, authSignoutHandler);
registerHandler('auth-setToken', [
  middlewares,
  validateArgs(tokenSchema),
], authSetTokenHandler);

export function authSigninHandler() {
  authLogin();
}

export function authSignoutHandler(state) {
  return R.assoc('token', null, state);
}

export function authSetTokenHandler(state, [token]) {
  return R.assoc('token', token, state);
}
