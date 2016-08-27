export let __hotReload = true;

import log from 'app/helpers/log';
import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { FormEdit, FormInput } from 'app/components/form/form';
import { schema } from 'app/components/players/state';
import { playersNamesSub } from 'app/components/players/sub';

export const PlayerEdit = React.createClass({
  mixins: [ subscriptionsMixin, pureRenderMixin ],
  subscriptions: {
    players_names: playersNamesSub
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
                 order="1" />
      <FormInput name="faction"
                 label="Faction"
                 type="text"
                 order="2" />
    </FormEdit>
  );
}

function playerEditGetInitialState() {
  return { players_names: [] };
}
