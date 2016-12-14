export let __hotReload = true;

import R from 'app/helpers/ramda';
import tap from 'app/helpers/middlewares/tap';
import stateService from 'app/services/state';
const { dispatch, registerHandler } = stateService;

const offlineService = {
  unregisterWorker: offlineUnregisterWorker,
  registerWorker: offlineRegisterWorker,
};

export default offlineService;

function offlineUnregisterWorker() {
  R.threadP()(
    () => navigator.serviceWorker
      .getRegistrations(),
    (registrations) => {
      for (let registration of registrations) {
        console.info('Found worker', registration);
        registration.unregister();
      }
    }
  );
}

function offlineRegisterWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service worker is not available');
    return;
  }

  navigator.serviceWorker
    .register('/service-worker.js', { scope: '/' })
    .then(onRegistrationSuccess)
    .catch((error) => {
      console.log(`Registration failed with ${error}`);
    });

  function onRegistrationSuccess(reg) {
    let installing;
    console.log(`Registration succeeded. Scope is ${reg.scope}`);
    reg.addEventListener('updatefound', onUpdateFound);

    function onUpdateFound() {
      installing = reg.installing;
      console.log('Update found', reg);
      installing.addEventListener('statechange', onStateChange);
    }

    function onStateChange() {
      console.log('State change', installing);
      switch (installing.state) {
      case 'installed':
        {
          if (navigator.serviceWorker.controller) {
            dispatch({
              eventName: 'prompt-set',
              type: 'alert',
              msg: 'New version available !',
              onOk: { eventName: 'offline-reload' },
            });
          }
          else {
            dispatch({
              eventName: 'prompt-set',
              type: 'alert',
              msg: 'Application installed !',
              onOk: { eventName: 'offline-installed' },
            });
          }
          break;
        }
      case 'redundant':
        {
          console.warn('ServiceWorker became redundant');
          break;
        }
      }
    }
  }
}

registerHandler('offline-reload', [
  tap,
], () => {
  console.log('reloading');
  self.location.reload(true);
});

registerHandler('offline-installed', R.identity);
