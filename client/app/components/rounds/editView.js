export let __hotReload = true;

import R from 'app/helpers/ramda';
import { factionsSub } from 'app/components/factions/factions';
import { roundSchema } from 'app/components/rounds/state';
import { roundsEditSub } from 'app/components/rounds/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { FormEdit, FormInput } from 'app/components/form/form';
import { RoundGamesEdit } from 'app/components/rounds/gamesEditView';
/* eslint-enable no-unused-vars */
import playersModel from 'app/models/players';
import roundModel from 'app/models/round';

export const RoundEdit = createComponent({
  displayName: 'RoundEdit',
  subscriptions: {
    edit: roundsEditSub,
    factions: factionsSub,
  },
  render,
  getInitialState,
});

function render() {
  console.debug('roundEdit render', this.state);
  const round = R.pathOr({}, ['edit','round'], this.state);
  const games = R.pathOr([], ['edit','round','games'], this.state);
  const players = R.pathOr([], ['edit','players'], this.state);
  const playersNames = roundModel.annotatePairedPlayersNames(
    { players },
    round
  );
  console.log(playersNames);
  const formSchema = roundSchema(players);
  const warnings = R.pathOr([], ['edit','warnings'], this.state);
  const warningsInfos = R.map((warning) => (
    <p key={warning}
       className="warning-info">
      {warning}
    </p>
  ), warnings);
  return (
    <FormEdit name="round"
              label={this.props.label}
              schema={formSchema}
              onSubmit={this.props.onSubmit}>
      <table className="gamesList">
        <thead>
          <tr>
            <th>
              Player1
            </th>
            <th>
            </th>
            <th>
              Table
            </th>
            <th>
            </th>
            <th>
              Player2
            </th>
          </tr>
        </thead>
        <RoundGamesEdit
           games={games}
           playersNames={playersNames}
           playersFactions={playersModel.factions(players)}
           factions={this.state.factions} />
      </table>
      {warningsInfos}
    </FormEdit>
  );
}

function getInitialState() {
  return {
    edit: {
      players: [],
      round: {},
      errors: [],
      warnings: [],
    },
  };
}
