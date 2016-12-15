export let __hotReload = true;

import stateService from 'app/services/state';
const { dispatch,
        registerValidator } = stateService;

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

registerValidator('auth', scope, authSchema);

export function authLogin() {
  getLock().then((lock) => lock.show());
}

function onLogin(result) {
  dispatch({ eventName: 'auth-setToken', token: result.idToken });
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
