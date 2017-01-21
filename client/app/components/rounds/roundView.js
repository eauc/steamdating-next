export let __hotReload = true;

import R from 'app/helpers/ramda';
import { factionsSub } from 'app/components/factions/factions';
import { playersSub } from 'app/components/players/players';
import { roundsNthSub } from 'app/components/rounds/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { FilterInput } from 'app/components/filter/filter';
import { RoundGameRow } from 'app/components/rounds/roundGameRowView';
import { RoundHeader } from 'app/components/rounds/roundHeaderView';
/* eslint-enable no-unused-vars */
import stateService from 'app/services/state';
const { dispatch } = stateService;
import playersModel from 'app/models/players';

export const Round = createComponent({
  displayName: 'Round',
  subscriptions: {
    factions: factionsSub,
    players: playersSub,
    round: getRoundSub,
  },
  render,
  getInitialState,
  doEditGame,
});

function getRoundSub() {
  return roundsNthSub([this.props.index]);
}

function render() {
  console.debug('round render', this.props, this.state);
  const playersFactions = playersModel.factions(this.state.players);
  const round = R.defaultTo({}, this.state.round);
  const gamesRows = R.map((game) => {
    return (
      <RoundGameRow key={game.index}
                    game={game}
                    roundIndex={this.props.index}
                    factions={this.state.factions}
                    playersFactions={playersFactions}
                    />
    );
  }, R.propOr([], 'games', round));
  return (
    <div>
      <FilterInput name="roundsNth" />
      <table className="list">
        <thead>
          <RoundHeader />
        </thead>
        <tbody>
          {gamesRows}
        </tbody>
      </table>
    </div>
  );
}

function getInitialState() {
  return {
    edit: {
      round: {},
      factions: {},
    },
  };
}

function doEditGame({ game: { index } }) {
  const roundIndex = this.props.index;
  const gameIndex = index;
  dispatch({ eventName: 'rounds-startGameEdit', roundIndex, gameIndex });
}
