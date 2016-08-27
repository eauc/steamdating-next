export let __hotReload = true;

import R from 'app/helpers/ramda';

const playersModel = {
  add: playersAdd,
  update: playersUpdate
};

export default R.curryService(playersModel);

function playersAdd(add, players) {
  return R.thread(players)(
    R.append(add),
    R.uniqBy(R.prop('name'))
  );
}

function playersUpdate(name, update, players) {
  const index = R.findIndex(R.whereEq({name}), players);
  if(-1 === index) return players;
  return R.adjust(R.deepMerge([update]), index, players);
}
