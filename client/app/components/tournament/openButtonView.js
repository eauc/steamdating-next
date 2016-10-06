export let __hotReload = true;

/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
import { FileOpenButton } from 'app/components/file/file';
/* eslint-enable no-unused-vars */

export const TournamentOpenButton = createComponent({
  render: openButtonRender,
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
