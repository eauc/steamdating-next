export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';
import factionsModel from 'app/models/factions';

export const FactionIcon = createComponent({
  displayName: 'FactionIcon',
  render: factionIconRender
});

function factionIconRender() {
  const src = factionsModel
          .iconFor(this.props.faction, this.props.factions);
  return (
    <img src={src} />
  );
}
