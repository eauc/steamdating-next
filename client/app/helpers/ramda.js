export let __hotReload = true;

import R from 'ramda';
import curryService from 'app/helpers/ramda/curryService';
import { deepMerge, deepMergeObject, deepMergeArray } from 'app/helpers/ramda/deepMerge';
import exists from 'app/helpers/ramda/exists';
import { jsonParse, jsonStringify } from 'app/helpers/ramda/json';
import spy from 'app/helpers/ramda/spy';
import { thread, threadP } from 'app/helpers/ramda/thread';
import viewOr from 'app/helpers/ramda/viewOr';

export default R.pipe(
  R.assoc('curryService', curryService),
  R.assoc('deepMerge', deepMerge),
  R.assoc('deepMergeArray', deepMergeArray),
  R.assoc('deepMergeObject', deepMergeObject),
  R.assoc('exists', exists),
  R.assoc('jsonParse', jsonParse),
  R.assoc('jsonStringify', jsonStringify),
  R.assoc('spy', spy),
  R.assoc('thread', thread),
  R.assoc('threadP', threadP),
  R.assoc('viewOr', viewOr)
)(R);
