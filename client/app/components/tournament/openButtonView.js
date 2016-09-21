export let __hotReload = true;

import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
import { FileOpenButton } from 'app/components/file/file';

export const TournamentOpenButton = createComponent({
  render: openButtonRender
});

function openButtonRender() {
  return (
    <FileOpenButton
       name="tournament"
       onOpen="tournament-open">
      <Icon name="folder-open-o" />
      <span> Open</span>
    </FileOpenButton>
  );
}
