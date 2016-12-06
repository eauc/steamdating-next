export let __hotReload = true;

import R from 'app/helpers/ramda';
import fileService from 'app/services/file';
import stateService from 'app/services/state';
const { registerSubscription } = stateService;

export const fileSub = registerSubscription('file', (state, [_name_, path, transform]) => {
  let fileUrl;
  return state
    .map(R.path(path))
    .map(transform)
    .map(fileService.generate)
    .map(R.tap((url) => {
      fileService.cleanup(fileUrl);
      fileUrl = url;
    }));
});
