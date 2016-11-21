export let __hotReload = true;

import R from 'app/helpers/ramda';
import { dispatch,
         registerValidator } from 'app/services/state';
import { registerInit } from 'app/services/init';
import authModel from 'app/models/auth';

export const scope = ['auth'];
export const tokenSchema = {
  oneOf: [
    { type: 'null' },
    {
      type: 'string',
      minLength: 1,
    },
  ],
};
export const authSchema = {
  type: 'object',
  properties: {
    token: tokenSchema,
  },
  required: ['token'],
  additionnalProperties: false,
};

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
          auth: {
            loginAfterSignup: true,
            redirect: false,
            params: { scope: 'openid email permissions' },
          },
        });
      lock.on('authenticated', onLogin);
      return lock;
    });
}
