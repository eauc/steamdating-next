export let __hotReload = true;

import R from 'app/helpers/ramda';
import fileService from 'app/services/file';
import { registerSubscription } from 'app/services/state';

export const fileSub = registerSubscription('file', (state, [_name_, path, transform]) => {
  let tournament_file_url;
  return state
    .map(R.path(path))
    .map(transform)
    .map(fileService.generate)
    .map(R.tap((url) => {
      fileService.cleanup(tournament_file_url);
      tournament_file_url = url;
    }));
});
