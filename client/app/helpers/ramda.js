export let __hotReload = true;

import R from 'ramda';
import spy from 'app/helpers/ramda/spy';
import exists from 'app/helpers/ramda/exists';
import curryService from 'app/helpers/ramda/curryService';
import { thread, threadP } from 'app/helpers/ramda/thread';
import viewOr from 'app/helpers/ramda/viewOr';

export default R.pipe(
  R.assoc('curryService', curryService),
  R.assoc('exists', exists),
  R.assoc('spy', spy),
  R.assoc('thread', thread),
  R.assoc('threadP', threadP),
  R.assoc('viewOr', viewOr)
)(R);
