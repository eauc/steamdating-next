export let __hotReload = true;

import R from 'app/helpers/ramda';
import gameModel from 'app/models/game';
import playersModel from 'app/models/players';

const roundModel = {
  create,
  game,
  setPlayerName,
  renamePlayer,
  updateGame,
  filter,
  sort,
  playerResult,
  annotatePairedPlayersNames,
  validate,
};

export default R.curryService(roundModel);

function create({ players }, base) {
  const nbGames = Math.floor((R.length(players) + 1) / 2);
  return R.deepMerge([base], {
    games: R.times(() => gameModel.create({}), nbGames),
  });
}

function game({ index }, round) {
  return R.thread(round)(
    R.propOr([], 'games'),
    R.nth(index)
  );
}

function setPlayerName(fieldPath, name, round) {
  console.log('setPlayerName', fieldPath, name, round);
  return R.thread(round)(
    R.over(R.lensProp('games'), R.map(gameModel.resetPlayer$({ name }))),
    R.updateIn(fieldPath, name)
  );
}

function renamePlayer({ oldName, newName }, round) {
  return R.over(
    R.lensProp('games'),
    R.map(gameModel.renamePlayer$({ oldName, newName })),
    round
  );
}

function updateGame({ game, gameIndex }, round) {
  return R.over(
    R.lensProp('games'),
    R.update(gameIndex, game),
    round
  );
}

function filter({ filterRegExp }, round) {
  return R.over(
    R.lensPropOr([], 'games'),
    R.filter((game) => {
      const test1 = filterRegExp.test(R.pathOr('', ['player1','name'], game));
      const test2 = filterRegExp.test(R.pathOr('', ['player2','name'], game));
      return test1 || test2;
    }),
    round
  );
}

function sort({ reverse, by }, round) {
  const comparator = sortByComparator(R.split('.', by));
  return R.over(
    R.lensPropOr([], 'games'),
    R.pipe(
      R.sort(comparator),
      R.when(() => reverse, R.reverse)
    ),
    round
  );
}

function sortByComparator(by) {
  return R.comparator((gameA, gameB) => {
    let byA = R.when(
      R.compose(R.equals('String'), R.type),
      R.toLower,
      R.pathOr('', by, gameA)
    );
    let byB = R.when(
      R.compose(R.equals('String'), R.type),
      R.toLower,
      R.pathOr('', by, gameB)
    );
    return R.lt(byA, byB);
  });
}

function playerResult({ player }, round) {
  return R.thread(round.games)(
    R.findIndex((game) => R.contains(
      player.name,
      gameModel.playersNames(game)
    )),
    (index) => R.thread(index)(
      R.ifElse(
        R.lte(0),
        R.nth(R.__, round.games),
        () => gameModel.create({ player1: { name: player.name } })
      ),
      (game) => ({
        index,
        table: game.table,
        list: gameModel.listForPlayer({ name: player.name }, game),
        opponent: gameModel.opponentForPlayer({ name: player.name }, game),
        win: gameModel.winForPlayer({ name: player.name }, game),
        loss: gameModel.lossForPlayer({ name: player.name }, game),
        score: gameModel.scoreForPlayer({ name: player.name }, game),
      })
    )
  );
}

function annotatePairedPlayersNames({ players }, round) {
  const games = R.propOr([], 'games', round);
  const allPlayersNames = playersModel.names(players);
  const pairedPlayersNames = R.thread(games)(
    R.chain(gameModel.playersNames),
    R.filter(R.exists),
    R.uniq,
    R.sortBy(R.identity)
  );
  const playersNotPaired = R.difference(allPlayersNames, pairedPlayersNames);
  return [
    ...R.map((name) => [name, `> ${name}`], playersNotPaired),
    ...R.map((name) => [name, name], pairedPlayersNames),
  ];
}

function validate({ players }, round) {
  const errors = [];
  const warnings = [];

  const games = R.propOr([], 'games', round);

  const allPlayersNames = playersModel.names(players);
  const pairedPlayersNames = R.thread(games)(
    R.chain(gameModel.playersNames),
    R.filter(R.exists)
  );
  const playersNotPaired = R.difference(allPlayersNames, pairedPlayersNames);
  if (!R.isEmpty(playersNotPaired)) {
    const single = R.length(playersNotPaired) === 1;
    errors.push(`Player${single ? '' : 's'} ${R.join(', ', playersNotPaired)} ${single ? 'is' : 'are'} not paired`);
  }
  const playersPairedMoreThanOnce = R.thread(pairedPlayersNames)(
    R.countBy(R.identity),
    R.toPairs,
    R.filter(([_name_, count]) => (count > 1)),
    R.map(R.head)
  );
  if (!R.isEmpty(playersPairedMoreThanOnce)) {
    const single = R.length(playersPairedMoreThanOnce) === 1;
    errors.push(`Player${single ? '' : 's'} ${R.join(', ', playersPairedMoreThanOnce)} ${single ? 'is' : 'are'} paired more than once`);
  }

  const allTables = R.range(1, R.length(games) + 1);
  const affectedTables = R.pluck('table', games);
  const tablesNotAffected = R.difference(allTables, affectedTables);
  if (!R.isEmpty(tablesNotAffected)) {
    const single = R.length(tablesNotAffected) === 1;
    warnings.push(`Table${single ? '' : 's'} ${R.join(', ', tablesNotAffected)} ${single ? 'is' : 'are'} not affected`);
  }

  const playersFactions = playersModel.factions(players);
  const mirrorGames = R.filter(gameModel.isMirror$({ playersFactions }), games);
  if (!R.isEmpty(mirrorGames)) {
    const single = R.length(mirrorGames) === 1;
    warnings.push(`There ${single ? 'is' : 'are'} ${R.length(mirrorGames)} mirror game${single ? '' : 's'}`);
  }

  return {
    errors,
    warnings,
  };
}
