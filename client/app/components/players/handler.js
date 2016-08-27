export let __hotReload = true;

// import R from 'app/helpers/ramda';
import log from 'app/helpers/log';
import { registerHandler } from 'app/services/state';
import history from 'app/helpers/history';
// import path from 'app/helpers/middlewares/path';
// import stripv from 'app/helpers/middlewares/stripv';
// import { scope } from 'app/components/players/state';

// const middlewares = [
//   path(scope, {}),
//   stripv
// ];

registerHandler('players-create', (state) => {
  log('create-player', state);
  history.goBack();
  return state;
});
