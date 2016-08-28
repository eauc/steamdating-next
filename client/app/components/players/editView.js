export let __hotReload = true;

import log from 'app/helpers/log';
import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { FormEdit, FormInput } from 'app/components/form/form';
import { schema } from 'app/components/players/state';
import { playersEditOtherNamesSub } from 'app/components/players/sub';

export const PlayerEdit = React.createClass({
  mixins: [ subscriptionsMixin, pureRenderMixin ],
  subscriptions: {
    players_names: playersEditOtherNamesSub
  },
  render: playerEditRender,
  getInitialState: playerEditGetInitialState
});

function playerEditRender() {
  log.cycle('playerEdit render', this.state);
  const form_schema = schema.player(this.state.players_names);
  return (
    <FormEdit name="player"
              label={`${this.props.label} Player`}
              schema={form_schema}
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
                 options={this.factions}
                 order="3" />
      <FormInput name="notes"
                 label="Notes"
                 type="textarea"
                 order="4" />
    </FormEdit>
  );
}

function playerEditGetInitialState() {
  this.factions = [
    'Circle Orboros',
    'Convergence of Cyriss',
    'Cryx',
    'Cygnar',
    'Khador',
    'Legion of Everblight',
    'Mercenaries',
    'Minions',
    'Protectorate of Menoth',
    'Retribution of Scyrah',
    'Skorne',
    'Trollbloods',
  ];
  return { players_names: [] };
}
