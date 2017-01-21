export let __hotReload = true;

import R from 'app/helpers/ramda';
import roundModel from 'app/models/round';

const roundsModel = {
  add,
  round,
};

export default R.curryService(roundsModel);

function add(addRound, rounds) {
  return R.append(addRound, rounds);
}

function round({ index }, rounds) {
  return R.nth(index, rounds);
}
