export let __hotReload = true;

import R from 'app/helpers/ramda';

const playersModel = {
  add,
  filter,
  remove,
  sort,
  update,
  names,
  factions,
};

export default R.curryService(playersModel);

const LIST_COLUMNS = ['name','origin','faction','lists'];

function add(addPlayer, players) {
  return R.thread(players)(
    R.append(addPlayer),
    R.uniqBy(R.prop('name'))
  );
}

function filter(filterInput, players) {
  let filterValue = R.isNil(filterInput) || R.isEmpty(filterInput)
        ? '.*'
        : filterInput;
  filterValue = filterValue.replace(/\s+/g, '|');
  const regex = new RegExp(filterValue, 'i');
  return R.thread(players)(
    R.map((player) => [player, R.toPairs(R.pick(LIST_COLUMNS, player))]),
    R.map(([player, pairs]) => [
      player,
      R.filter(([_key_, value]) => regex.test(JSON.stringify(value)), pairs),
    ]),
    R.reject(([_player_, pairs]) => R.isEmpty(pairs)),
    (matches) => ({
      list: R.map(R.head, matches),
      columns: R.thread(matches)(
        R.chain(R.compose(R.map(R.head), R.nth(1))),
        R.prepend('name'),
        R.flip(R.concat)(LIST_COLUMNS),
        R.uniq
      ),
    })
  );
}

function remove(name, players) {
  return R.reject(R.whereEq({ name }), players);
}

function sort({ reverse, by }, players) {
  const comparator = sortByComparator(by);
  let sorted = R.sort(comparator, players);
  if (reverse) sorted = R.reverse(sorted);
  return sorted;
}

function update(name, updateValue, players) {
  const index = R.findIndex(R.whereEq({ name }), players);
  if (-1 === index) return players;
  return R.adjust(R.deepMerge([updateValue]), index, players);
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

function names(players) {
  return R.sortBy(R.identity, R.pluck('name', players));
}

function factions(players) {
  return R.reduce((mem, player) => {
    // eslint-disable-next-line no-param-reassign
    mem[player.name] = player.faction;
    return mem;
  }, {}, players);
}
