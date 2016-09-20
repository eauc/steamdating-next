export let __hotReload = true;

import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import { Icon } from 'app/components/misc/misc';
import { FileOpenButton } from 'app/components/file/file';

export const TournamentOpenButton = React.createClass({
  render: openButtonRender,
  mixins: [ pureRenderMixin ]
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
