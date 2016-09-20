export let __hotReload = true;

import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import styles from 'app/helpers/styles';

export const FileDownloadButton = styles.decorator(React.createClass({
  displayName: 'FileDownloadButton',
  mixins: [ pureRenderMixin ],
  render: fileDownloadButtonRender
}));

function fileDownloadButtonRender() {
  const name = `${this.props.fileName}_${Date.now()}.json`;
  return (
    <a href={this.props.fileUrl}
       download={name}>
      {this.props.children}
    </a>
  );
}
