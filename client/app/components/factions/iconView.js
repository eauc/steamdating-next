export let __hotReload = true;

import factionsModel from 'app/models/factions';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
/* eslint-enable no-unused-vars */

export const FactionIcon = createComponent({
  displayName: 'FactionIcon',
  render: factionIconRender,
});

function factionIconRender() {
  const src = factionsModel
          .iconFor(this.props.faction, this.props.factions);
  return (
    <img src={src} />
  );
}
