export let __hotReload = true;

import R from 'app/helpers/ramda';

const playersModel = {
  add: playersAdd,
  filter: playersFilter,
  remove: playersRemove,
  sort: playersSort,
  update: playersUpdate
};

export default R.curryService(playersModel);

const LIST_COLUMNS = ['name','origin','faction','lists'];

function playersAdd(add, players) {
  return R.thread(players)(
    R.append(add),
    R.uniqBy(R.prop('name'))
  );
}

function playersFilter(filter, players) {
  filter = R.isEmpty(filter) ? '.*' : filter;
  filter = filter.replace(/\s+/g, '|');
  const regex = new RegExp(filter, 'i');
  return R.thread(players)(
    R.map((o) => [o, R.toPairs(R.pick(LIST_COLUMNS, o))]),
    R.map(([o, p]) => [o, R.filter(([_k_, v]) => regex.test(JSON.stringify(v)), p)]),
    R.reject(([_o_, p]) => R.isEmpty(p)),
    (matches) => ({ list: R.map(R.head, matches),
                    columns: R.thread(matches)(
                      R.chain(R.compose(R.map(R.head), R.nth(1))),
                      R.prepend('name'),
                      R.flip(R.concat)(LIST_COLUMNS),
                      R.uniq
                    )
                  })
  );
}

function playersRemove(name, players) {
  return R.reject(R.whereEq({name}), players);
}

function playersSort({reverse, by}, players) {
  const comparator = sortByComparator(by);
  let sorted = R.sort(comparator, players);
  if(reverse) sorted = R.reverse(sorted);
  return sorted;
}

function playersUpdate(name, update, players) {
  const index = R.findIndex(R.whereEq({name}), players);
  if(-1 === index) return players;
  return R.adjust(R.deepMerge([update]), index, players);
}

function sortByComparator(by) {
  return R.comparator((a,b) => {
    let by_a = R.toLower(R.prop(by, a));
    let by_b = R.toLower(R.prop(by, b));
    if(by_a === by_b && by !== 'name') {
      return R.lt(R.toLower(R.prop('name', a)),
                  R.toLower(R.prop('name', b)));
    }
    return R.lt(by_a, by_b);
  });
}
