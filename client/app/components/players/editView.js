export let __hotReload = true;

import log from 'app/helpers/log';
import { factionsNamesSub } from 'app/components/factions/factions';
import { playerSchema } from 'app/components/players/state';
import { playersEditCastersNamesSub,
         playersEditOtherNamesSub } from 'app/components/players/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { FormEdit, FormInput } from 'app/components/form/form';
/* eslint-enable no-unused-vars */

export const PlayerEdit = createComponent({
  subscriptions: {
    factionsNames: factionsNamesSub,
    castersNames: playersEditCastersNamesSub,
    playersNames: playersEditOtherNamesSub,
  },
  render: playerEditRender,
  getInitialState: playerEditGetInitialState,
});

function playerEditRender() {
  log.cycle('playerEdit render', this.state);
  const formSchema = playerSchema(this.state.playersNames);
  return (
    <FormEdit name="player"
              label={`${this.props.label} Player`}
              schema={formSchema}
              onSubmit={this.props.onSubmit}>
      <FormInput name="name"
                 label="Name"
                 type="text"
                 required="required"
                 autofocus="autofocus"
                 order="1" />
      <FormInput name="origin"
                 label="Origin"
                 type="text"
                 order="2" />
      <FormInput name="faction"
                 label="Faction"
                 type="select"
                 options={this.state.factionsNames}
                 order="3" />
      <FormInput name="lists"
                 label="Lists"
                 type="select"
                 options={this.state.castersNames}
                 multiple="multiple"
                 order="4" />
      <FormInput name="notes"
                 label="Notes"
                 type="textarea"
                 order="5" />
    </FormEdit>
  );
}

function playerEditGetInitialState() {
  return {
    castersNames: {},
    factionsNames: {},
    playersNames: [],
  };
}
