export let __hotReload = true;

import log from 'app/helpers/log';
import React from 'react';
import styles from 'app/helpers/styles';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import subscriptionsMixin from 'app/mixins/subscriptions';
import { Icon } from 'app/components/misc/misc';
import { tournamentFileSub } from 'app/components/tournament/tournament';

export const DownloadButton = styles.decorator(React.createClass({
  displayName: 'DownloadButton',
  mixins: [ pureRenderMixin, subscriptionsMixin ],
  subscriptions: { file: tournamentFileSub },
  render: downloadButtonRender,
  getInitialState: downloadButtonGetInitialState
}));

function downloadButtonRender() {
  log.cycle('downloadButton', this.state);
  const name = `steamdating_${Date.now()}.json`;
  return (
    <a href={this.state.file} download={name}>
      <Icon name="save" />
    </a>
  );
}

function downloadButtonGetInitialState() {
  return { file: null };
}
