export let __hotReload = true;

import React from 'react';
import styles from 'app/helpers/styles';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import factionsModel from 'app/models/factions';

export const FactionIcon = styles.decorator(React.createClass({
  displayName: 'FactionIcon',
  mixins: [ pureRenderMixin ],
  render: factionIconRender
}));

function factionIconRender() {
  const src = factionsModel
          .iconFor(this.props.faction, this.props.factions);
  return (
    <img src={src} />
  );
}
