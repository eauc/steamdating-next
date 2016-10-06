export let __hotReload = true;

import { tournamentFileSub } from 'app/components/tournament/sub';
/* eslint-disable no-unused-vars */
import { React, createComponent } from 'app/helpers/react';
import { Icon } from 'app/components/misc/misc';
import { FileDownloadButton } from 'app/components/file/file';
/* eslint-enable no-unused-vars */

export const TournamentSaveButton = createComponent({
  subscriptions: { url: tournamentFileSub },
  render: saveButtonRender,
  getInitialState: saveButtonGetInitialState,
});

function saveButtonRender() {
  const label = (
    this.props.iconOnly
      ? ''
      : ' Save'
  );
  return (
    <FileDownloadButton
       fileUrl={this.state.url}
       fileName="steamdating">
      <Icon name="save" />
      <span>{label}</span>
    </FileDownloadButton>
  );
}

function saveButtonGetInitialState() {
  return {};
}
