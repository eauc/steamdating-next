export let __hotReload = true;

import React from 'react';
import { Icon } from 'app/components/misc/misc';
import { FileOpenButton } from 'app/components/file/file';

export const TournamentOpenButton = React.createClass({
  render: openButtonRender
});

function openButtonRender() {
  return (
    <FileOpenButton
       onOpen="tournament-open">
      <Icon name="folder-open-o" />
      <span> Open</span>
    </FileOpenButton>
  );
}
