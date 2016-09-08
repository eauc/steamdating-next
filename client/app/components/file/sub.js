export let __hotReload = true;

import R from 'app/helpers/ramda';
import fileService from 'app/services/file';
import { registerSubscription } from 'app/services/state';

let tournament_file_url;
export const tournamentFileSub = registerSubscription('tournament-file', (state) => {
  return state
    .map(R.prop('tournament'))
    .map(R.assoc('version', 1))
    .map(fileService.generate)
    .map(R.tap((url) => {
      fileService.cleanup(tournament_file_url);
      tournament_file_url = url;
    }));
});
