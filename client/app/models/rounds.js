export let __hotReload = true;

import R from 'app/helpers/ramda';

const roundsModel = {
  add,
};

export default R.curryService(roundsModel);

function add(addRound, rounds) {
  return R.append(addRound, rounds);
}
