export let __hotReload = true;

import R from 'app/helpers/ramda';
import Joi from 'joi-browser';
import { dispatch,
         registerValidator } from 'app/services/state';
import { registerInit } from 'app/services/init';
import authModel from 'app/models/auth';

export const scope = ['auth'];
export const tokenSchema = Joi.alternatives(null, Joi.string());
export const authSchema = Joi.object({
  token: tokenSchema,
});

let lock;

registerInit('auth', [], authInit);
registerValidator('auth', scope, authSchema);

function authInit(state) {
  return R.assocPath(scope, authModel.create(), state);
}

export function authLogin() {
  getLock().then((lock) => lock.show());
}

function onLogin(result) {
  dispatch(['auth-setToken', result.idToken]);
}

function getLock() {
  if (!lock) {
    return initLock();
  }
  return self.Promise.resolve(lock);
}

function initLock() {
  return self.System.import('auth0-lock')
    .then((Auth0Lock) => {
      lock = new Auth0Lock(
        self.STEAMDATING_CONFIG.auth.client_id,
        self.STEAMDATING_CONFIG.auth.domain,
        { ui: { autoClose: true },
          auth: { loginAfterSignup: true,
                  redirect: false,
                  params: { scope: 'openid email permissions' } } });
      lock.on('authenticated', onLogin);
      return lock;
    });
}
