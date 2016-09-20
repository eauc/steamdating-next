export let __hotReload = true;

import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { tournamentFileSub } from 'app/components/tournament/sub';
import { Icon } from 'app/components/misc/misc';
import { FileDownloadButton } from 'app/components/file/file';

export const TournamentSaveButton = React.createClass({
  mixins: [ pureRenderMixin,
            subscriptionsMixin ],
  subscriptions: { url: tournamentFileSub },
  render: saveButtonRender,
  getInitialState: saveButtonGetInitialState
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
