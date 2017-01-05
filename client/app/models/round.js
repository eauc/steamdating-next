export let __hotReload = true;

import R from 'app/helpers/ramda';
import gameModel from 'app/models/game';
import playersModel from 'app/models/players';

const roundModel = {
  create,
  setPlayerName,
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

function setPlayerName(fieldPath, name, round) {
  console.log('setPlayerName', fieldPath, name, round);
  return R.thread(round)(
    R.over(R.lensProp('games'), R.map(gameModel.resetPlayer$({ name }))),
    R.updateIn(fieldPath, name)
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
