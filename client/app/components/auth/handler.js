export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import tap from 'app/helpers/middlewares/tap';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import authModel from 'app/models/auth';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import { scope, tokenSchema, authLogin } from 'app/components/auth/state';

registerHandler('auth-signin', [
  tap,
], () => { authLogin(); });

registerHandler('auth-signout', [
  path(scope, {}),
], (state) => authModel.reset(state));

registerHandler('auth-setToken', [
  path(scope, {}),
  validateArgs({ token: tokenSchema }),
], (state, { token }) => authModel.setToken(token, state));
