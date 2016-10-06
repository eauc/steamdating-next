export let __hotReload = true;

import R from 'app/helpers/ramda';

const playersModel = {
  add: playersAdd,
  filter: playersFilter,
  remove: playersRemove,
  sort: playersSort,
  update: playersUpdate,
};

export default R.curryService(playersModel);

const LIST_COLUMNS = ['name','origin','faction','lists'];

function playersAdd(add, players) {
  return R.thread(players)(
    R.append(add),
    R.uniqBy(R.prop('name'))
  );
}

function playersFilter(filterInput, players) {
  let filter = R.isEmpty(filterInput) ? '.*' : filterInput;
  filter = filter.replace(/\s+/g, '|');
  const regex = new RegExp(filter, 'i');
  return R.thread(players)(
    R.map((player) => [player, R.toPairs(R.pick(LIST_COLUMNS, player))]),
    R.map(([player, pairs]) => [
      player,
      R.filter(([_key_, value]) => regex.test(JSON.stringify(value)), pairs),
    ]),
    R.reject(([_player_, pairs]) => R.isEmpty(pairs)),
    (matches) => ({ list: R.map(R.head, matches),
                    columns: R.thread(matches)(
                      R.chain(R.compose(R.map(R.head), R.nth(1))),
                      R.prepend('name'),
                      R.flip(R.concat)(LIST_COLUMNS),
                      R.uniq
                    ),
                  })
  );
}

function playersRemove(name, players) {
  return R.reject(R.whereEq({ name }), players);
}

function playersSort({ reverse, by }, players) {
  const comparator = sortByComparator(by);
  let sorted = R.sort(comparator, players);
  if (reverse) sorted = R.reverse(sorted);
  return sorted;
}

function playersUpdate(name, update, players) {
  const index = R.findIndex(R.whereEq({ name }), players);
  if (-1 === index) return players;
  return R.adjust(R.deepMerge([update]), index, players);
}

function sortByComparator(by) {
  return R.comparator((playerA, playerB) => {
    let byA = R.toLower(R.prop(by, playerA));
    let byB = R.toLower(R.prop(by, playerB));
    if (byA === byB && by !== 'name') {
      return R.lt(R.toLower(R.prop('name', playerA)),
                  R.toLower(R.prop('name', playerB)));
    }
    return R.lt(byA, byB);
  });
}
