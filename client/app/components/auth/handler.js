export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import stripv from 'app/helpers/middlewares/stripv';
import tap from 'app/helpers/middlewares/tap';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import authModel from 'app/models/auth';
import { registerHandler } from 'app/services/state';
import { scope, tokenSchema, authLogin } from 'app/components/auth/state';

const middlewares = [
  path(scope, {}),
  stripv,
];

registerHandler('auth-signin', [
  middlewares,
  tap,
], () => { authLogin(); });

registerHandler(
  'auth-signout',
  middlewares,
  (state) => authModel.reset(state)
);

registerHandler('auth-setToken', [
  middlewares,
  validateArgs(tokenSchema),
], (state, [token]) => authModel.setToken(token, state));
