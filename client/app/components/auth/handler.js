export let __hotReload = true;

import path from 'app/helpers/middlewares/path';
import tap from 'app/helpers/middlewares/tap';
import validateArgs from 'app/helpers/middlewares/validateArgs';
import { registerInit } from 'app/services/init';
import stateService from 'app/services/state';
const { registerHandler } = stateService;
import authModel from 'app/models/auth';
import { scope, tokenSchema, authLogin } from 'app/components/auth/state';

registerHandler('auth-init', [
  path(scope, {}),
], (state) => authModel.create(state));
registerInit('auth-init', ['storage-init']);

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
